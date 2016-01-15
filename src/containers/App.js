import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TracksActions from '../actions/tracks';
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

const Actions = Object.assign(TracksActions, TrackActions, MeasureActions, PlayingNoteActions, CursorActions);

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
    this.loadSoundfont2(this.props.instrument);
    // this.loadSoundfont(this.props.instrument);
  }

  componentWillReceiveProps(nextProps) {
    const { playingNote } = nextProps;

    if(this.props.playingNote && playingNote) {
      if(playingNote.noteIndex !== this.props.playingNote.noteIndex || playingNote.measure !== this.props.playingNote.measure) {
        this.updateScrollPosition(nextProps.playingNote, nextProps.measures);
      }
    } else if(this.props.instrument !== nextProps.instrument) {
      this.loadSoundfont2(nextProps.instrument);
      // this.loadSoundfont(nextProps.instrument);
    }
  }

  loadSoundfont = (instrument) => {
    Soundfont.loadBuffers(audioContext, instrument).then((buffers) => {
      this.setState({
        buffers: Object.assign({}, this.state.buffers, { [instrument]: buffers })
      });
    });
  };

  loadSoundfont2 = (instrument) => {
    const nonbuffers = localStorage.getItem(instrument);

    if(nonbuffers) {
      Soundfont.decodeArray(audioContext, JSON.parse(nonbuffers)).then((buffers) => {
        this.setState({
          buffers: Object.assign({}, this.state.buffers, { [instrument]: buffers })
        });
      });
    } else {
      Soundfont.loadNonBuffers(audioContext, instrument).then((ns) => {
        localStorage.setItem(instrument, JSON.stringify(ns));
        Soundfont.decodeArray(audioContext, ns).then((buffers) => {
          this.setState({
            buffers: Object.assign({}, this.state.buffers, { [instrument]: buffers })
          });
        });
      });
    }
  };

  handleResize = () => {
    this.props.actions.resize();
  };

  getXOfCurrentNote = (playingNote, measures) => {
    const { measure, noteIndex } = playingNote;
    const xOfMeasures = measures.reduce((acc, curr, i) => {
      if(i >= measure) {
        return acc;
      }
      return acc + curr.width;
    }, 0);

    return xOfMeasures + 55 * noteIndex;
  };

  getYOfCurrentNote = (playingNote, measures) => {
    const position = measures[playingNote.measure];
    return (position.rowIndex) * (27 * this.props.tuning.length) + 50;
  };

  updateScrollPosition = (playingNote, measures) => {
    if(this.props.layout === 'linear') {
      const x = this.getXOfCurrentNote(playingNote, measures);
      const { scrollX, innerWidth } = window;

      if(x > innerWidth + scrollX - 200) {
        window.scroll(x - 200, 0);
      }
    } else {
      const y = this.getYOfCurrentNote(playingNote, measures);
      const { innerHeight, scrollY } = window;

      if(y > innerHeight + scrollY - 270) {
        window.scroll(0, y - 100);
      }
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
    const { measures } = this.props;
    const { measureIndex, noteIndex } = this.props.cursor;

    return measures[measureIndex].notes[noteIndex];
  };

  navigateCursor = (event) => {
    if(event.keyCode === 39) { // right arrow
      event.preventDefault();
      const { measures } = this.props;
      const { measureIndex, noteIndex } = this.props.cursor;
      if(measureIndex === measures.length - 1 &&
        (noteIndex === measures[measureIndex].notes.length - 1 || measures[measureIndex].notes.length === 0)
      ) {
        this.props.actions.insertMeasure();
      }
      this.props.actions.moveCursorRight();
    } else if(event.keyCode === 37) { // left arrow
      event.preventDefault();
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

  deleteNote = () => {
    const { measureIndex } = this.props.cursor;
    let notes = this.props.measures[measureIndex].notes;

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

    if(event.keyCode <= 57 && event.keyCode >= 48 && !event.metaKey) {
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
    } else if(event.keyCode === 73 && !event.metaKey) { // i
      return this.insertNote();
    } else if(event.keyCode === 32) { // spacebar
      event.preventDefault();
      return this.props.playingNote ? this.handleStop() : this.handlePlay();
    } else if(event.keyCode === 190) { // period
      this.props.actions.toggleNoteDotted(this.props.cursor);
    } else if(event.shiftKey && event.keyCode === 187) { // plus
      return this.props.actions.increaseNoteLength(this.props.cursor);
    } else if(event.keyCode === 189) { // minus
      return this.props.actions.decreaseNoteLength(this.props.cursor);
    } else if(event.shiftKey && event.keyCode === 222) { // "
      this.props.actions.toggleNoteTremolo(this.props.cursor);
    } else if(event.keyCode === 86) { // v
      this.props.actions.toggleNoteVibrato(this.props.cursor);
    } else {
      return this.navigateCursor(event);
    }
  };

  openModal = (openModal) => {
    this.setState({ openModal });
  };

  closeModal = () => {
    this.setState({ openModal: null });
  };

  render() {
    const { openModal, buffers } = this.state;

    return (
      <div style={{ width: '100%', height: '100%' }}>
        { this.props.playingNote ? <Playback buffers={buffers} /> : null}
        <EditorArea handlePlay={this.handlePlay} handleStop={this.handleStop} openModal={this.openModal} />
        <TabStaff />
        <TimeSignatureModal isOpen={openModal === 'timeSig'} closeModal={this.closeModal} />
        <TuningModal isOpen={openModal === 'tuning'} closeModal={this.closeModal} />
        <BpmModal isOpen={openModal === 'bpm'} closeModal={this.closeModal} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    measures: state.tracks[state.currentTrackIndex].measures,
    clipboard: state.clipboard,
    layout: state.layout,
    playingNote: state.playingNote,
    cursor: state.cursor,
    tuning: state.tracks[state.currentTrackIndex].tuning,
    instrument: state.tracks[state.currentTrackIndex].instrument
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
