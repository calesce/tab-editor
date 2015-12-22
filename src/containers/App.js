import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/track';
import { playCurrentNote, getReplaySpeedForNote } from '../util/audio';

import Soundfont from 'soundfont-player';

import TabRows from '../components/TabRows';
import EditorArea from '../components/editor/EditorArea';
import TimeSignatureModal from '../components/editor/TimeSignatureModal';

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
      currentPlayingNote: {
        measure: 0,
        noteIndex: 0
      },
      currentEditingIndex: {
        measureIndex: 0,
        noteIndex: 0,
        stringIndex: 0
      },
      audioContext,
      isPlaying: false,
      bpm: 120,
      layout: 'page'
    };
  }

  componentWillMount = () => {
    const ctx = this.state.audioContext;

    Soundfont.loadBuffers(ctx, 'acoustic_guitar_steel').then((buffers) => {
      this.setState({ buffers });
    });
  }

  handleResize = () => {
    this.forceUpdate();
  }

  startPlayback = () => {
    let startTimestamp = Date.now();
    playCurrentNote(this.state.audioContext, this.props.track, this.state.bpm, this.state.currentPlayingNote, this.state.buffers);

    this.setState({
      timer: requestAnimationFrame(() => {
        this.loopThroughSong(startTimestamp);
      })
    });
  }

  loopThroughSong = (startTimestamp) => {
    let { currentPlayingNote, bpm, audioContext } = this.state;
    let { measure, noteIndex } = currentPlayingNote;
    let { track } = this.props;

    let currentTimestamp = Date.now();
    let replayDiff = currentTimestamp - startTimestamp;

    let measureToPlay = track[currentPlayingNote.measure];

    let replaySpeed;
    if(measureToPlay.notes.length > 0) {
      replaySpeed = getReplaySpeedForNote(measureToPlay.notes[noteIndex], bpm);
    } else {
      replaySpeed = bpm * 4;
    }

    if(replayDiff >= replaySpeed) {
      if(measure === track.length - 1 && noteIndex >= track[measure].notes.length - 1) {
        this.handleStop();
      } else if(measure !== track.length - 1 && noteIndex >= track[measure].notes.length - 1) {
        this.setState({
          currentPlayingNote: {
            measure: measure + 1,
            noteIndex: 0
          },
          currentEditingIndex: {
            stringIndex: this.state.currentEditingIndex.stringIndex,
            measureIndex: measure + 1,
            noteIndex: 0
          },
          timer: requestAnimationFrame(() => {
            this.loopThroughSong(currentTimestamp);
          })
        }, () => {
          playCurrentNote(audioContext, track, this.state.bpm, this.state.currentPlayingNote, this.state.buffers);
        });
      } else {
        this.setState({
          currentPlayingNote: {
            measure: measure,
            noteIndex: noteIndex + 1
          },
          currentEditingIndex: {
            stringIndex: this.state.currentEditingIndex.stringIndex,
            measureIndex: measure,
            noteIndex: noteIndex + 1
          },
          timer: requestAnimationFrame(() => {
            this.loopThroughSong(currentTimestamp);
          })
        }, () => {
          playCurrentNote(audioContext, track, this.state.bpm, this.state.currentPlayingNote, this.state.buffers);
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
      isPlaying: false
    });
  }

  handlePlay = (event) => {
    if(this.state.isPlaying) {
      return;
    }

    this.setState({
      isPlaying: true,
    }, () => {
      this.startPlayback();
    });
  }

  onNoteClick = (index) => {
    this.setState({
      currentEditingIndex: index,
      currentPlayingNote: {
        measure: index.measureIndex,
        noteIndex: index.noteIndex
      }
    });
  }

  getNextNote = (measureIndex, noteIndex) => {
    const { track } = this.props;

    if(measureIndex === track.length - 1 && noteIndex >= track[measureIndex].notes.length - 1) {
      return 'NEW';
    } else if(noteIndex >= track[measureIndex].notes.length - 1) {
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
    const { track } = this.props;

    if(measureIndex === 0 && noteIndex === 0) {
      return { measureIndex, noteIndex };
    } else if(noteIndex === 0) {
      let prevMeasure = track[measureIndex - 1];
      if(prevMeasure.notes.length > 0) {
        return {
          measureIndex: measureIndex - 1,
          noteIndex: track[measureIndex - 1].notes.length - 1
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
    let { measureIndex, noteIndex, stringIndex } = this.state.currentEditingIndex;

    if(event.keyCode === 39) { // right arrow
      let newEditingIndex = this.getNextNote(measureIndex, noteIndex);
      if(newEditingIndex === 'NEW') {
        this.props.dispatch({
          type: 'INSERT_MEASURE',
          index: 0
        });
        newEditingIndex = {
          stringIndex,
          measureIndex: measureIndex + 1,
          noteIndex: 0
        };
        this.setState({
          currentEditingIndex: newEditingIndex,
          currentPlayingNote: {
            measure: newEditingIndex.measureIndex,
            noteIndex: newEditingIndex.noteIndex
          }
        });
      } else {
        newEditingIndex.stringIndex = stringIndex;
        this.setState({
          currentEditingIndex: newEditingIndex,
          currentPlayingNote: {
            measure: newEditingIndex.measureIndex,
            noteIndex: newEditingIndex.noteIndex
          }
        });
      }
    } else if(event.keyCode === 37) { // left arrow
      let newEditingIndex = this.getPrevNote(measureIndex, noteIndex);
      newEditingIndex.stringIndex = stringIndex;
      this.setState({
        currentEditingIndex: newEditingIndex,
        currentPlayingNote: {
          measure: newEditingIndex.measureIndex,
          noteIndex: newEditingIndex.noteIndex
        }
      });
    } else if(event.keyCode === 38) { // up arrow
      event.preventDefault();
      let newEditingIndex = {
        stringIndex: this.getUpperString(stringIndex),
        noteIndex,
        measureIndex
      };
      this.setState({
        currentEditingIndex: newEditingIndex
      });
    } else if(event.keyCode === 40) { // down arrow
      event.preventDefault();
      let newEditingIndex = {
        stringIndex: this.getLowerString(stringIndex),
        noteIndex,
        measureIndex
      };
      this.setState({
        currentEditingIndex: newEditingIndex
      });
    }
  }

  editNote = (fret) => {
    this.props.dispatch({
      type: 'CHANGE_NOTE',
      fret,
      index: this.state.currentEditingIndex
    });
  }

  changeNoteLength = (duration) => {
    this.props.dispatch({
      type: 'CHANGE_NOTE_LENGTH',
      duration,
      index: this.state.currentEditingIndex
    });
  }

  deleteNote = () => {
    const { noteIndex, measureIndex, stringIndex } = this.state.currentEditingIndex;
    let notes = this.props.track[measureIndex].notes;

    if(notes.length > 1 && noteIndex === notes.length - 1 && notes[notes.length - 1].fret[0] === 'rest') {
      this.setState({
        currentEditingIndex: {
          stringIndex,
          measureIndex,
          noteIndex: noteIndex - 1
        }
      }, () => {
        this.props.dispatch({
          type: 'DELETE_NOTE',
          index: {
            stringIndex,
            measureIndex,
            noteIndex
          }
        });
      });
    } else if(notes.length === 0) {
      this.props.dispatch({
        type: 'DELETE_MEASURE',
        measureIndex
      });

      if(measureIndex === this.props.track.length) {
        this.setState({
          currentEditingIndex: {
            stringIndex,
            measureIndex: measureIndex - 1,
            noteIndex: 0
          }
        });
      }
    } else {
      this.props.dispatch({
        type: 'DELETE_NOTE',
        index: this.state.currentEditingIndex
      });
    }
  }

  insertNote = () => {
    const { noteIndex, measureIndex, stringIndex } = this.state.currentEditingIndex;

    this.props.dispatch({
      type: 'INSERT_NOTE',
      index: this.state.currentEditingIndex
    });

    if(this.props.track[measureIndex].notes.length === 1) {
      this.setState({
        currentEditingIndex: {
          measureIndex,
          stringIndex,
          noteIndex: 0
        }
      });
    } else {
      this.setState({
        currentEditingIndex: {
          measureIndex,
          stringIndex,
          noteIndex: noteIndex + 1
        }
      });
    }
  }

  handleKeyPress = (event) => {
    if(event.metaKey) {
      return;
    } else if(this.state.isPlaying && event.keyCode !== 32) {
      return;
    }

    if(event.keyCode <= 57 && event.keyCode >= 48) {
      return this.editNote(event.keyCode - 48);
    } else if(event.keyCode === 82 && !event.metaKey && !event.ctrlKey) {
      this.props.dispatch({
        type: 'CHANGE_NOTE',
        fret: 'rest',
        index: this.state.currentEditingIndex
      });
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
      return this.state.isPlaying ? this.handleStop() : this.handlePlay();
    } else if(event.keyCode === 190) { // period
      this.props.dispatch({
        type: 'TOGGLE_NOTE_DOTTED',
        index: this.state.currentEditingIndex
      });
    } else {
      return this.navigateCursor(event);
    }
  }

  bpmChanged = (event) => {
    this.setState({
      bpm: event.target.value
    });
  }

  openTimeSignatureModal = () => {
    this.setState({
      modalIsOpen: true
    });
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false
    });
  }

  toggleLayout = () => {
    let layout = this.state.layout === 'page' ? 'linear' : 'page';
    this.setState({ layout });
  }

  render() {
    const { track, dispatch } = this.props;
    const { measureIndex } = this.state.currentEditingIndex;
    const timeSignature = track[measureIndex] ? track[measureIndex].timeSignature : '4/4';

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <EditorArea bpmChanged={this.bpmChanged}
          handlePlay={this.handlePlay}
          handleStop={this.handleStop}
          openModal={this.openTimeSignatureModal}
          toggleLayout={this.toggleLayout}
          bpm={this.state.bpm}
          timeSignature={timeSignature}
          layout={this.state.layout}
        />
        <TabRows track={this.props.track}
          currentEditingIndex={this.state.currentEditingIndex}
          currentPlayingNote={this.state.currentPlayingNote}
          isPlaying={this.state.isPlaying}
          onClick={this.onNoteClick}
          layout={this.state.layout}
        />
        <TimeSignatureModal isOpen={this.state.modalIsOpen}
          closeModal={this.closeModal}
          dispatch={dispatch}
          measureIndex={measureIndex}
          timeSignature={timeSignature}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    track: state.track
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps)(App);
