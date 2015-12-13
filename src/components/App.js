import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/song';
import { playCurrentNote, getReplaySpeedForNote } from '../util/audio';

import TabStaff from './TabStaff';

class App extends Component {
  constructor(props) {
    super(props);

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyPress);
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
      audioContext: audioContext,
      isPlaying: false,
      bpm: 120
    };
  }

  startPlayback = () => {
    let startTimestamp = Date.now();
    playCurrentNote(this.state.audioContext, this.props.song, this.state.bpm, this.state.currentPlayingNote);

    this.setState({
      timer: requestAnimationFrame(() => {
        this.loopThroughSong(startTimestamp);
      })
    });
  }

  loopThroughSong = (startTimestamp) => {
    let { currentPlayingNote, bpm, audioContext } = this.state;
    let { measure, noteIndex } = currentPlayingNote;
    let { song } = this.props;

    let currentTimestamp = Date.now();
    let replayDiff = currentTimestamp - startTimestamp;

    let measureToPlay = song[currentPlayingNote.measure];

    let replaySpeed;
    if(measureToPlay.notes.length > 0) {
      replaySpeed = getReplaySpeedForNote(measureToPlay.notes[noteIndex], bpm);
    } else {
      replaySpeed = bpm * 4;
    }

    if(replayDiff >= replaySpeed) {
      if(measure === song.length - 1 && noteIndex >= song[measure].notes.length - 1) {
        this.handleStop();
      } else if(measure !== song.length - 1 && noteIndex >= song[measure].notes.length - 1) {
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
          playCurrentNote(audioContext, song, this.state.bpm, this.state.currentPlayingNote);
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
          playCurrentNote(audioContext, song, this.state.bpm, this.state.currentPlayingNote);
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
    const { song } = this.props;

    if(measureIndex === song.length - 1 && noteIndex >= song[measureIndex].notes.length - 1) {
      return 'NEW';
    } else if(noteIndex >= song[measureIndex].notes.length - 1) {
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
    const { song } = this.props;

    if(measureIndex === 0 && noteIndex === 0) {
      return { measureIndex, noteIndex };
    } else if(noteIndex === 0) {
      let prevMeasure = song[measureIndex - 1];
      if(prevMeasure.notes.length > 0) {
        return {
          measureIndex: measureIndex - 1,
          noteIndex: song[measureIndex - 1].notes.length - 1
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
    let notes = this.props.song[measureIndex].notes;

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

      if(measureIndex === this.props.song.length) {
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

    this.setState({
      currentEditingIndex: {
        measureIndex,
        stringIndex,
        noteIndex: noteIndex + 1
      }
    });
  }

  handleKeyPress = (event) => {
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
    } else if(event.keyCode === 72) { // h
      return this.changeNoteLength('h');
    } else if(event.keyCode === 73) { // i
      return this.insertNote();
    }
    return this.navigateCursor(event);
  }

  bpmChanged = (event) => {
    this.setState({
      bpm: event.target.value
    });
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '50' }}>
          BPM:
          <input onChange={this.bpmChanged} value={this.state.bpm} />
          <button onClick={this.handlePlay}>Play</button>
          <button onClick={this.handleStop}>Stop</button>
        </div>
        <TabStaff song={this.props.song}
          currentEditingIndex={this.state.currentEditingIndex}
          currentPlayingNote={this.state.currentPlayingNote}
          isPlaying={this.state.isPlaying}
          onClick={this.onNoteClick}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    song: state.song
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps)(App);
