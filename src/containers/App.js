import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TrackActions from '../actions/track';
import * as MeasureActions from '../actions/measure';
import * as PlayingNoteActions from '../actions/playingNote';
import * as CursorActions from '../actions/cursor';

import Soundfont from 'soundfont-player';
import audioContext from '../util/audioContext';

import TabStaff from '../components/TabStaff';
import EditorArea from '../components/editor/EditorArea';
import TimeSignatureModal from '../components/editor/TimeSignatureModal';
import TuningModal from '../components/editor/TuningModal';
import BpmModal from '../components/editor/BpmModal';
import Playback from '../components/Playback';

const Actions = Object.assign(TrackActions, MeasureActions, PlayingNoteActions, CursorActions);

class App extends Component {
  constructor(props) {
    super(props);

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyPress);
      window.addEventListener('resize', this.handleResize);
    }

    this.state = {
      openModal: null
    };
  }

  componentWillMount() {
    Soundfont.loadBuffers(audioContext, 'acoustic_guitar_steel').then((buffers) => {
      this.setState({ buffers });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { playingNote } = nextProps;

    if(this.props.playingNote && playingNote) {
      if(playingNote.noteIndex !== this.props.playingNote.noteIndex || playingNote.measure !== this.props.playingNote.measure) {
        this.updateScrollPosition(nextProps.playingNote);
      }
    }
  }

  handleResize = () => {
    this.props.actions.resize();
  };

  getXOfCurrentNote = (playingNote) => {
    const { measure, noteIndex } = playingNote;
    const xOfMeasures = this.props.track.measures.reduce((acc, curr, i) => {
      if(i >= measure) {
        return acc;
      }
      return acc + curr.width;
    }, 0);

    return xOfMeasures + 55 * noteIndex;
  };

  updateScrollPosition = (playingNote) => {
    const x = this.getXOfCurrentNote(playingNote);
    const scrollX = window.scrollX;

    if(x > window.innerWidth + scrollX - 200 && this.props.layout === 'linear') {
      window.scroll(x - 200, 0);
    }
  };

  handleStop = () => {
    this.props.actions.setCursor({
      measureIndex: this.props.playingNote.measure,
      noteIndex: this.props.playingNote.noteIndex,
      stringIndex: this.props.cursor.stringIndex
    });
    this.props.actions.setPlayingNote(null);
  };

  handlePlay = () => {
    if(this.props.playingNote || !this.state.buffers) {
      return;
    }

    const { noteIndex, measureIndex } = this.props.cursor;

    this.props.actions.setPlayingNote({
      measure: measureIndex,
      noteIndex
    });
  };

  getCurrentNote = () => {
    const { measures } = this.props.track;
    const { measureIndex, noteIndex } = this.props.cursor;

    return measures[measureIndex].notes[noteIndex];
  };

  navigateCursor = (event) => {
    //event.preventDefault();
    if(event.keyCode === 39) { // right arrow
      const { measures } = this.props.track;
      const { measureIndex, noteIndex } = this.props.cursor;
      if(measureIndex === measures.length - 1 &&
        (noteIndex === measures[measureIndex].notes.length - 1 || measures[measureIndex].notes.length === 0)
      ) {
        this.props.actions.insertMeasure();
      }
      this.props.actions.moveCursorRight();
    } else if(event.keyCode === 37) { // left arrow
      this.props.actions.moveCursorLeft();
    } else if(event.keyCode === 38) { // up arrow
      this.props.actions.moveCursorUp();
    } else if(event.keyCode === 40) { // down arrow
      this.props.actions.moveCursorDown();
    }
  };

  editNote = (fret) => {
    this.props.actions.changeNote(this.props.cursor, fret);
  };

  changeNoteLength = (duration) => {
    this.props.actions.changeNoteLength(this.props.cursor, duration);
  };

  increaseNoteLength = ({ measureIndex, noteIndex }) => {
    const note = this.props.track.measures[measureIndex].notes[noteIndex];

    let newDuration;
    switch(note.duration) {
      case 'w':
        newDuration = 'h';
        break;
      case 'h':
        newDuration = 'q';
        break;
      case 'q':
        newDuration = 'e';
        break;
      case 'e':
        newDuration = 's';
        break;
      case 's':
        newDuration = 't';
        break;
      default:
        newDuration = 's';
    }
    this.props.actions.changeNoteLength(this.props.cursor, newDuration);
  };

  decreaseNoteLength = ({ measureIndex, noteIndex }) => {
    const note = this.props.track.measures[measureIndex].notes[noteIndex];

    let newDuration;
    switch(note.duration) {
      case 't':
        newDuration = 's';
        break;
      case 's':
        newDuration = 'e';
        break;
      case 'e':
        newDuration = 'q';
        break;
      case 'q':
        newDuration = 'h';
        break;
      case 'h':
        newDuration = 'w';
        break;
      default:
        newDuration = 'w';
    }
    this.props.actions.changeNoteLength(this.props.cursor, newDuration);
  };

  deleteNote = () => {
    const { measureIndex } = this.props.cursor;
    let notes = this.props.track.measures[measureIndex].notes;

    if(notes.length > 0) {
      this.props.actions.deleteNote(this.props.cursor);
    } else if(notes.length === 0) {
      this.props.actions.deleteMeasure(measureIndex);
    }
  };

  insertNote = () => {
    this.props.actions.insertNote(this.props.cursor);
  };

  pasteNote = () => {
    if(this.props.clipboard) {
      event.preventDefault();
      this.props.actions.pasteNote(this.props.cursor, this.props.clipboard);
    }
  };

  handleKeyPress = (event) => {
    if(this.state.openModal || (this.props.playingNote && event.keyCode !== 32)) {
      return;
    }

    if((event.metaKey || event.ctrlKey) && event.keyCode === 67) { // cmd/ctrl+c
      event.preventDefault();
      return this.props.actions.copyNote(this.getCurrentNote());
    }
    if((event.metaKey || event.ctrlKey) && event.keyCode === 86) { // cmd/ctrl+v
      return this.pasteNote();
    }
    if((event.metaKey || event.ctrlKey) && event.keyCode === 88) { // cmd/ctrl+x
      event.preventDefault();
      this.props.actions.cutNote(this.props.cursor, this.getCurrentNote());
    }

    if(event.keyCode <= 57 && event.keyCode >= 48) {
      return this.editNote(event.keyCode - 48);
    } else if(event.keyCode === 82 && !event.metaKey && !event.ctrlKey) {
      this.props.actions.changeNote(this.props.cursor, 'rest');
    } else if(event.keyCode === 8) { // delete
      event.preventDefault();
      this.deleteNote();
    } else if(event.keyCode === 69) { // e
      return this.changeNoteLength('e');
    } else if(event.keyCode === 83) { // s
      return this.changeNoteLength('s');
    } else if(event.keyCode === 81) { // q
      return this.changeNoteLength('q');
    } else if(event.keyCode === 87) { // w
      return this.changeNoteLength('w');
    } else if(event.keyCode === 72 && !event.ctrlKey) { // h
      return this.changeNoteLength('h');
    } else if(event.keyCode === 73) { // i
      return this.insertNote();
    } else if(event.keyCode === 32) { // spacebar
      event.preventDefault();
      return this.props.playingNote ? this.handleStop() : this.handlePlay();
    } else if(event.keyCode === 190) { // period
      this.props.actions.toggleNoteDotted(this.props.cursor);
    } else if(event.shiftKey && event.keyCode === 187) { // plus
      return this.increaseNoteLength(this.props.cursor);
    } else if(event.keyCode === 189) { // minus
      return this.decreaseNoteLength(this.props.cursor);
    } else if(event.shiftKey && event.keyCode === 222) { // "
      this.props.actions.toggleNoteTremolo(this.props.cursor);
    } else {
      return this.navigateCursor(event);
    }
  };

  openTimeSignatureModal = () => {
    this.setState({ openModal: 'timeSignature' });
  };

  openBpmModal = () => {
    this.setState({ openModal: 'bpm' });
  };

  closeModal = () => {
    this.setState({ openModal: null });
  };

  openTuningModal = () => {
    this.setState({ openModal: 'tuning' });
  };

  render() {
    const { measures } = this.props.track;
    const { cursor } = this.props;
    const { openModal, buffers } = this.state;
    const { measureIndex } = cursor;
    const timeSignature = measures[measureIndex] ? measures[measureIndex].timeSignature : '4/4';

    return (
      <div style={{ width: '100%', height: '100%' }}>
        { this.props.playingNote ? <Playback buffers={buffers} /> : null}
        <EditorArea handlePlay={this.handlePlay} handleStop={this.handleStop}
          openModal={this.openTimeSignatureModal}
          openTuning={this.openTuningModal}
          openBpm={this.openBpmModal}
          timeSignature={timeSignature}
        />
        <TabStaff />
        <TimeSignatureModal isOpen={openModal === 'timeSignature'} closeModal={this.closeModal} />
        <TuningModal isOpen={openModal === 'tuning'} closeModal={this.closeModal} />
        <BpmModal isOpen={openModal === 'bpm'} closeModal={this.closeModal} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    track: state.tracks[state.currentTrackIndex],
    clipboard: state.clipboard,
    layout: state.layout,
    playingNote: state.playingNote,
    cursor: state.cursor
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
