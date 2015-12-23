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
    let { measures } = this.props.track;

    let currentTimestamp = Date.now();
    let replayDiff = currentTimestamp - startTimestamp;

    let measureToPlay = measures[currentPlayingNote.measure];

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
          currentEditingIndex: {
            stringIndex: this.state.currentEditingIndex.stringIndex,
            measureIndex: measure + 1,
            noteIndex: 0
          },
          timer: requestAnimationFrame(() => {
            this.loopThroughSong(currentTimestamp);
          })
        }, () => {
          playCurrentNote(audioContext, this.props.track, this.state.bpm, this.state.currentPlayingNote, this.state.buffers);
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
          playCurrentNote(audioContext, this.props.track, this.state.bpm, this.state.currentPlayingNote, this.state.buffers);
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
    if(this.state.isPlaying || !this.state.buffers) {
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
    let { measureIndex, noteIndex, stringIndex } = this.state.currentEditingIndex;

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
    this.props.actions.changeNote(this.state.currentEditingIndex, fret);
  }

  changeNoteLength = (duration) => {
    this.props.actions.changeNoteLength(this.state.currentEditingIndex, duration);
  }

  deleteNote = () => {
    const { noteIndex, measureIndex, stringIndex } = this.state.currentEditingIndex;
    let notes = this.props.track.measures[measureIndex].notes;

    if(notes.length > 1 && noteIndex === notes.length - 1 && notes[notes.length - 1].fret[0] === 'rest') {
      this.setState({
        currentEditingIndex: {
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
          currentEditingIndex: {
            stringIndex,
            measureIndex: measureIndex - 1,
            noteIndex: 0
          }
        });
      }
    } else {
      this.props.actions.deleteNote(this.state.currentEditingIndex);
    }
  }

  insertNote = () => {
    const { noteIndex, measureIndex, stringIndex } = this.state.currentEditingIndex;

    this.props.actions.insertNote(this.state.currentEditingIndex);

    if(this.props.track.measures[measureIndex].notes.length === 1) {
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
      this.props.actions.changeNote(this.state.currentEditingIndex, 'rest');
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
      this.props.actions.toggleNoteDotted(this.state.currentEditingIndex);
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
    const { measures } = this.props.track;
    const { measureIndex } = this.state.currentEditingIndex;
    const timeSignature = measures[measureIndex] ? measures[measureIndex].timeSignature : '4/4';

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
        <TabRows track={measures}
          currentEditingIndex={this.state.currentEditingIndex}
          currentPlayingNote={this.state.currentPlayingNote}
          isPlaying={this.state.isPlaying}
          onClick={this.onNoteClick}
          layout={this.state.layout}
        />
        <TimeSignatureModal isOpen={this.state.modalIsOpen}
          closeModal={this.closeModal}
          changeTimeSignature={this.props.actions.changeTimeSignature}
          measureIndex={measureIndex}
          timeSignature={timeSignature}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    track: state.tracks[state.currentTrackIndex]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
