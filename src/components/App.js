import React, { Component } from 'react';
import TabStaff from './TabStaff';
import _ from 'lodash';

export default class App extends Component {
  constructor(props) {
    super(props);

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyPress);
    }

    let newSong = _.cloneDeep(this.props.song);

    this.state = {
      song: newSong,
      currentPlayingNote: {
        measure: 0,
        noteIndex: 0
      },
      currentEditingIndex: {
        measureIndex: 0,
        noteIndex: 0,
        stringIndex: 0
      },
      audioContext: new AudioContext(),
      isPlaying: false,
      bpm: 120
    };
  }

  getSpeedFromBpm = (bpm) => {
    return 60000 / bpm;
  }

  startPlayback = () => {
    let startTimestamp = Date.now();
    this.playCurrentNote();

    this.setState({
      timer: requestAnimationFrame(() => {
        this.loopThroughSong(startTimestamp);
      })
    });
  }

  getReplaySpeedForNote = (note, bpm) => {
    let noteLength = note.duration[0];

    let replaySpeed = this.getSpeedFromBpm(bpm);
    if(noteLength === 'h') {
      replaySpeed = replaySpeed * 2;
    } else if(noteLength === 'w') {
      replaySpeed = replaySpeed * 4;
    } else if(noteLength === 'e') {
      replaySpeed = replaySpeed / 2;
    } else if(noteLength === 's') {
      replaySpeed = replaySpeed / 4;
    }

    return replaySpeed;
  }

  loopThroughSong = (startTimestamp) => {
    let { currentPlayingNote, bpm, song } = this.state;
    let { measure, noteIndex } = currentPlayingNote;

    let currentTimestamp = Date.now();
    let replayDiff = currentTimestamp - startTimestamp;
    let replaySpeed = this.getReplaySpeedForNote(song[currentPlayingNote.measure].notes[noteIndex], bpm);

    if(replayDiff >= replaySpeed) {
      if(measure === song.length - 1 && noteIndex === song[measure].notes.length - 1) {
        this.handleStop();
      } else if(measure !== song.length - 1 && noteIndex === song[measure].notes.length - 1) {
        this.setState({
          currentPlayingNote: {
            measure: measure + 1,
            noteIndex: 0
          },
          timer: requestAnimationFrame(() => {
            this.loopThroughSong(currentTimestamp);
          })
        }, this.playCurrentNote);
      } else {
        this.setState({
          currentPlayingNote: {
            measure: measure,
            noteIndex: noteIndex + 1
          },
          timer: requestAnimationFrame(() => {
            this.loopThroughSong(currentTimestamp);
          })
        }, this.playCurrentNote);
      }
    } else {
      this.setState({
        timer: requestAnimationFrame(() => {
          this.loopThroughSong(startTimestamp);
        })
      });
    }
  }

  playCurrentNote = () => {
    let noteToPlay = this.state.song[this.state.currentPlayingNote.measure].notes[this.state.currentPlayingNote.noteIndex];
    let replaySpeed = this.getReplaySpeedForNote(noteToPlay, this.state.bpm);

    if(noteToPlay.fret[0] === 'rest') {
      this.play(this.state.audioContext.currentTime, 'rest', replaySpeed);
    } else {
      this.playNoteAtTime(noteToPlay, this.state.audioContext.currentTime, replaySpeed);
    }
  }

  playNoteAtTime = (currentNote, playTime, duration) => {
    for(let i = 0; i < currentNote.string.length; i++) {
      let pitch = currentNote.fret[i] + (5 * currentNote.string[i]);
      if(currentNote.string[i] >= 4) {
        pitch = pitch - 1;
      }

      this.play(playTime, pitch, duration / 1000);
    }
  }

  play = (startTime, pitch, duration) => {
    let endTime = startTime + duration;

    let oscillator = this.state.audioContext.createOscillator();
    let gainNode = this.state.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.state.audioContext.destination);

    if(pitch !== 'rest') {
      oscillator.type = 'square';
      oscillator.detune.value = (pitch - 29) * 100;

      gainNode.gain.value = 0.025;
    } else {
      gainNode.gain.value = 0;
    }

    oscillator.start(startTime);
    oscillator.stop(endTime);
  }

  handleStop = () => {
    cancelAnimationFrame(this.state.timer);

    this.setState({
      isPlaying: false,
      currentPlayingNote: {
        measure: 0,
        noteIndex: 0
      }
    });
  }

  handlePlay = (event) => {
    if(this.state.isPlaying) {
      return;
    }

    this.setState({
      isPlaying: true,
      startTime: this.state.audioContext.currentTime + .005,
    }, () => {
      this.startPlayback();
    });
  }

  getNextNote = (measureIndex, noteIndex) => {
    const { song } = this.state;

    if(measureIndex === song.length - 1 && noteIndex === song[measureIndex].notes.length - 1) {
      return { measureIndex, noteIndex };
    } else if(noteIndex === song[measureIndex].notes.length - 1) {
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
    const { song } = this.state;

    if(measureIndex === 0 && noteIndex === 0) {
      return { measureIndex, noteIndex };
    } else if(noteIndex === 0) {
      return {
        measureIndex: measureIndex - 1,
        noteIndex: song[measureIndex - 1].notes.length - 1
      };
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

  handleKeyPress = (event) => {
    let { currentEditingIndex } = this.state;
    let { measureIndex, noteIndex, stringIndex } = currentEditingIndex;

    if(event.keyCode > 57 || event.keyCode < 48) {
      if(event.keyCode === 39) { // right arrow
        let newEditingIndex = this.getNextNote(measureIndex, noteIndex);
        newEditingIndex.stringIndex = stringIndex;
        this.setState({
          currentEditingIndex: newEditingIndex
        });
      } else if(event.keyCode === 37) { // left arrow
        let newEditingIndex = this.getPrevNote(measureIndex, noteIndex);
        newEditingIndex.stringIndex = stringIndex;
        this.setState({
          currentEditingIndex: newEditingIndex
        });
      } else if(event.keyCode === 38) { // up arrow
        let newEditingIndex = {
          stringIndex: this.getUpperString(stringIndex),
          noteIndex,
          measureIndex
        };
        this.setState({
          currentEditingIndex: newEditingIndex
        });
      } else if(event.keyCode === 40) { // down arrow
        let newEditingIndex = {
          stringIndex: this.getLowerString(stringIndex),
          noteIndex,
          measureIndex
        };
        this.setState({
          currentEditingIndex: newEditingIndex
        });
      }

      return;
    }

    let number = event.keyCode - 48;
    let measure = _.cloneDeep(this.state.song[measureIndex]);
    let note = measure.notes[noteIndex];

    if(_.findIndex(note.string, (theNote) => theNote === stringIndex) === -1) {
      if(note.fret.length > 0) {
        note.duration.push('q');
      }

      note.fret.push(number);
      note.string.push(stringIndex);
    } else {
      note.fret[note.fret.length - 1] = number;
      note.string[note.string.length - 1] = stringIndex;
    }

    measure.notes[noteIndex] = note;
    let song = _.cloneDeep(this.state.song);
    song[measureIndex] = measure;
    this.setState({ song });
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
        <TabStaff song={this.state.song}
          currentEditingIndex={this.state.currentEditingIndex}
          currentPlayingNote={this.state.currentPlayingNote}
          isPlaying={this.state.isPlaying}
        />
      </div>
    );
  }
}
