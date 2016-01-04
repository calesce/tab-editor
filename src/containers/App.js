import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as TrackActions from '../actions/track';
import * as MeasureActions from '../actions/measure';
import { playCurrentNote, getReplaySpeedForNote } from '../util/audio';

import Soundfont from 'soundfont-player';

import TabStaff from '../components/TabStaff';
import EditorArea from '../components/editor/EditorArea';
import TimeSignatureModal from '../components/editor/TimeSignatureModal';
import TuningModal from '../components/editor/TuningModal';
import BpmModal from '../components/editor/BpmModal';

const Actions = _.merge(TrackActions, MeasureActions);

class App extends Component {
  constructor(props) {
    super(props);

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyPress);
      window.addEventListener('resize', this.handleResize);
    }

    let audioContext;
    try {
      audioContext = new AudioContext();
    } catch(e) {
      audioContext = new webkitAudioContext();
    }

    this.state = {
      editingIndex: {
        measureIndex: 0,
        noteIndex: 0,
        stringIndex: 0
      },
      audioContext
    };
  }

  componentWillMount = () => {
    const ctx = this.state.audioContext;

    Soundfont.loadBuffers(ctx, 'acoustic_guitar_steel').then((buffers) => {
      this.setState({ buffers });
    });
  }

  handleResize = () => {
    this.props.actions.resize();
  }

  getXOfCurrentNote = () => {
    const { measure, noteIndex } = this.state.currentPlayingNote;
    const xOfMeasures = this.props.track.measures.reduce((acc, curr, i) => {
      if(i >= measure) {
        return acc;
      }
      return acc + curr.width;
    }, 0);

    return xOfMeasures + 55 * noteIndex;
  }

  updateScrollPosition = () => {
    const x = this.getXOfCurrentNote();
    const scrollX = window.scrollX;

    if(x > window.innerWidth + scrollX - 200 && this.props.layout === 'linear') {
      window.scroll(x - 200, 0);
    }
  }

  startPlayback = () => {
    let startTimestamp = Date.now();
    this.updateScrollPosition();
    playCurrentNote(this.state.audioContext, this.props.track, this.state.currentPlayingNote, this.state.buffers);

    this.setState({
      timer: requestAnimationFrame(() => {
        this.loopThroughSong(startTimestamp);
      })
    });
  }

  loopThroughSong = (startTimestamp) => {
    let { currentPlayingNote, audioContext } = this.state;
    let { measure, noteIndex } = currentPlayingNote;
    let { measures } = this.props.track;

    let currentTimestamp = Date.now();
    let replayDiff = currentTimestamp - startTimestamp;

    const measureToPlay = measures[currentPlayingNote.measure];
    const bpm = measureToPlay.bpm;

    let replaySpeed;
    if(measureToPlay.notes.length > 0) {
      replaySpeed = getReplaySpeedForNote(measureToPlay.notes[noteIndex], bpm);
    } else {
      replaySpeed = bpm * 4;
    }

    if(replayDiff >= replaySpeed) {
      if(measure === measures.length - 1 && noteIndex >= measures[measure].notes.length - 1) {
        this.handleStop();
      } else if(measure !== measures.length - 1 && noteIndex >= measures[measure].notes.length - 1) {
        this.setState({
          currentPlayingNote: {
            measure: measure + 1,
            noteIndex: 0
          },
          editingIndex: {
            stringIndex: this.state.editingIndex.stringIndex,
            measureIndex: measure + 1,
            noteIndex: 0
          },
          timer: requestAnimationFrame(() => {
            this.loopThroughSong(currentTimestamp);
          })
        }, () => {
          this.updateScrollPosition();
          playCurrentNote(audioContext, this.props.track, this.state.currentPlayingNote, this.state.buffers);
        });
      } else {
        this.setState({
          currentPlayingNote: {
            measure: measure,
            noteIndex: noteIndex + 1
          },
          editingIndex: {
            stringIndex: this.state.editingIndex.stringIndex,
            measureIndex: measure,
            noteIndex: noteIndex + 1
          },
          timer: requestAnimationFrame(() => {
            this.loopThroughSong(currentTimestamp);
          })
        }, () => {
          this.updateScrollPosition();
          playCurrentNote(audioContext, this.props.track, this.state.currentPlayingNote, this.state.buffers);
        });
      }
    } else {
      this.setState({
        timer: requestAnimationFrame(() => {
          this.loopThroughSong(startTimestamp);
        })
      });
    }
  }

  handleStop = () => {
    cancelAnimationFrame(this.state.timer);

    this.setState({
      currentPlayingNote: null
    });
  }

  handlePlay = () => {
    if(this.state.currentPlayingNote || !this.state.buffers) {
      return;
    }

    const { noteIndex, measureIndex } = this.state.editingIndex;

    this.setState({
      currentPlayingNote: {
        measure: measureIndex,
        noteIndex
      }
    }, () => {
      this.startPlayback();
    });
  }

  onNoteClick = (index) => {
    this.setState({ editingIndex: index });
  }

  getCurrentNote = () => {
    const { measures } = this.props.track;
    const { measureIndex, noteIndex } = this.state.editingIndex;

    return measures[measureIndex].notes[noteIndex];
  }

  getNextNote = (measureIndex, noteIndex) => {
    const { measures } = this.props.track;

    if(measureIndex === measures.length - 1 && noteIndex >= measures[measureIndex].notes.length - 1) {
      return 'NEW';
    } else if(noteIndex >= measures[measureIndex].notes.length - 1) {
      return {
        measureIndex: measureIndex + 1,
        noteIndex: 0
      };
    } else {
      return {
        measureIndex,
        noteIndex: noteIndex + 1
      };
    }
  }

  getPrevNote = (measureIndex, noteIndex) => {
    const { measures } = this.props.track;

    if(measureIndex === 0 && noteIndex === 0) {
      return { measureIndex, noteIndex };
    } else if(noteIndex === 0) {
      let prevMeasure = measures[measureIndex - 1];
      if(prevMeasure.notes.length > 0) {
        return {
          measureIndex: measureIndex - 1,
          noteIndex: measures[measureIndex - 1].notes.length - 1
        };
      } else {
        return {
          measureIndex: measureIndex - 1,
          noteIndex: 0
        };
      }
    } else {
      return {
        measureIndex,
        noteIndex: noteIndex - 1
      };
    }
  }

  getUpperString = (stringIndex) => {
    return stringIndex === 5 ? 0 : stringIndex + 1;
  }

  getLowerString = (stringIndex) => {
    return stringIndex === 0 ? 5 : stringIndex - 1;
  }

  navigateCursor = (event) => {
    let { measureIndex, noteIndex, stringIndex } = this.state.editingIndex;

    if(event.keyCode === 39) { // right arrow
      let newEditingIndex = this.getNextNote(measureIndex, noteIndex);
      if(newEditingIndex === 'NEW') {
        this.props.actions.insertMeasure(0);
        newEditingIndex = {
          stringIndex,
          measureIndex: measureIndex + 1,
          noteIndex: 0
        };
        this.setState({
          editingIndex: newEditingIndex
        });
      } else {
        newEditingIndex.stringIndex = stringIndex;
        this.setState({
          editingIndex: newEditingIndex
        });
      }
    } else if(event.keyCode === 37) { // left arrow
      let newEditingIndex = this.getPrevNote(measureIndex, noteIndex);
      newEditingIndex.stringIndex = stringIndex;
      this.setState({
        editingIndex: newEditingIndex
      });
    } else if(event.keyCode === 38) { // up arrow
      event.preventDefault();
      let newEditingIndex = {
        stringIndex: this.getUpperString(stringIndex),
        noteIndex,
        measureIndex
      };
      this.setState({
        editingIndex: newEditingIndex
      });
    } else if(event.keyCode === 40) { // down arrow
      event.preventDefault();
      let newEditingIndex = {
        stringIndex: this.getLowerString(stringIndex),
        noteIndex,
        measureIndex
      };
      this.setState({
        editingIndex: newEditingIndex
      });
    }
  }

  editNote = (fret) => {
    this.props.actions.changeNote(this.state.editingIndex, fret);
  }

  changeNoteLength = (duration) => {
    this.props.actions.changeNoteLength(this.state.editingIndex, duration);
  }

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
    this.props.actions.changeNoteLength(this.state.editingIndex, newDuration);
  }

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
    this.props.actions.changeNoteLength(this.state.editingIndex, newDuration);
  }

  deleteNote = () => {
    const { noteIndex, measureIndex, stringIndex } = this.state.editingIndex;
    let notes = this.props.track.measures[measureIndex].notes;

    if(notes.length > 1 && noteIndex === notes.length - 1 && notes[notes.length - 1].fret[0] === 'rest') {
      this.setState({
        editingIndex: {
          stringIndex,
          measureIndex,
          noteIndex: noteIndex - 1
        }
      }, () => {
        this.props.actions.deleteNote({ stringIndex, measureIndex, noteIndex });
      });
    } else if(notes.length === 0) {
      this.props.actions.deleteMeasure(measureIndex);

      if(measureIndex === this.props.track.measures.length) {
        this.setState({
          editingIndex: {
            stringIndex,
            measureIndex: measureIndex - 1,
            noteIndex: 0
          }
        });
      }
    } else {
      this.props.actions.deleteNote(this.state.editingIndex);
    }
  }

  insertNote = () => {
    const { noteIndex, measureIndex, stringIndex } = this.state.editingIndex;
    this.props.actions.insertNote(this.state.editingIndex);

    if(this.props.track.measures[measureIndex].notes.length !== 1) {
      this.setState({
        editingIndex: {
          measureIndex,
          stringIndex,
          noteIndex: noteIndex + 1
        }
      });
    }
  }

  pasteNote = () => {
    const { measureIndex, noteIndex, stringIndex } = this.state.editingIndex;

    if(this.props.clipboard) {
      event.preventDefault();
      this.props.actions.pasteNote(this.state.editingIndex, this.props.clipboard);
      this.setState({
        editingIndex: {
          measureIndex,
          noteIndex: this.props.track.measures[measureIndex].notes.length === 1 && noteIndex === 0 ? 0 : noteIndex + 1,
          stringIndex
        }
      });
    }
  }

  handleKeyPress = (event) => {
    if(this.state.openModal) {
      return;
    } else if(this.state.currentPlayingNote && event.keyCode !== 32) {
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
      const { noteIndex, measureIndex, stringIndex } = this.state.editingIndex;
      let notes = this.props.track.measures[measureIndex].notes;
      if(notes.length > 1 && noteIndex === notes.length - 1) {
        const currentNote = this.getCurrentNote();

        this.setState({
          editingIndex: {
            stringIndex,
            measureIndex,
            noteIndex: noteIndex - 1
          }
        }, () => {
          this.props.actions.cutNote({ noteIndex: noteIndex, measureIndex, stringIndex }, currentNote);
        });
      } else {
        return this.props.actions.cutNote({ noteIndex, measureIndex, stringIndex }, this.getCurrentNote());
      }
    }

    if(event.keyCode <= 57 && event.keyCode >= 48) {
      return this.editNote(event.keyCode - 48);
    } else if(event.keyCode === 82 && !event.metaKey && !event.ctrlKey) {
      this.props.actions.changeNote(this.state.editingIndex, 'rest');
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
      return this.state.currentPlayingNote ? this.handleStop() : this.handlePlay();
    } else if(event.keyCode === 190) { // period
      this.props.actions.toggleNoteDotted(this.state.editingIndex);
    } else if(event.shiftKey && event.keyCode === 187) { // plus
      return this.increaseNoteLength(this.state.editingIndex);
    } else if(event.keyCode === 189) { // minus
      return this.decreaseNoteLength(this.state.editingIndex);
    } else if(event.shiftKey && event.keyCode === 222) { // "
      this.props.actions.toggleNoteTremelo(this.state.editingIndex);
    } else {
      return this.navigateCursor(event);
    }
  }

  openTimeSignatureModal = () => {
    this.setState({ openModal: 'timeSignature' });
  }

  openBpmModal = () => {
    this.setState({ openModal: 'bpm' });
  }

  closeModal = () => {
    this.setState({ openModal: null });
  }

  openTuningModal = () => {
    this.setState({ openModal: 'tuning' });
  }

  render() {
    const { measures } = this.props.track;
    const { openModal, editingIndex } = this.state;
    const { measureIndex } = this.state.editingIndex;
    const timeSignature = measures[measureIndex] ? measures[measureIndex].timeSignature : '4/4';

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <EditorArea handlePlay={this.handlePlay}
          handleStop={this.handleStop}
          openModal={this.openTimeSignatureModal}
          openTuning={this.openTuningModal}
          openBpm={this.openBpmModal}
          timeSignature={timeSignature}
          currentPlayingNote={this.state.currentPlayingNote}
        />
        <TabStaff onClick={this.onNoteClick}
          editingIndex={this.state.editingIndex}
          currentPlayingNote={this.state.currentPlayingNote}
        />
        <TimeSignatureModal isOpen={openModal === 'timeSignature'} closeModal={this.closeModal} measureIndex={measureIndex} />
        <TuningModal isOpen={openModal === 'tuning'} closeModal={this.closeModal} />
        <BpmModal isOpen={openModal === 'bpm'} closeModal={this.closeModal} index={editingIndex} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    track: state.tracks[state.currentTrackIndex],
    clipboard: state.clipboard,
    layout: state.layout
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
