import React, { Component } from 'react';
import TabStaff from './TabStaff';
import _ from 'lodash';
import song from './song';

let requestId;
let noteTime;
let currentPlayingIndex = {
  measure: 0,
  noteIndex: 0
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      song: song,
      current: {
        measure: 0,
        noteIndex: 0
      },
      audioContext: new AudioContext(),
      isPlaying: false,
      speed: 485
    };
  }

  changeNotes = () => {
    let startTimestamp = Date.now();
    let endTimestamp = startTimestamp + this.state.speed;

    let noteInterval = () => {
      let { current, speed } = this.state;
      let { measure, noteIndex } = current;

      let currentTimestamp = Date.now();
      let replayDiff = currentTimestamp - startTimestamp;

      if(replayDiff >= this.state.speed) {
        startTimestamp = currentTimestamp;

        if(measure === song.length - 1 && noteIndex === song[measure].notes.length - 1) {

          this.setState({
            isPlaying: false,
            current: {
              measure: 0,
              noteIndex: 0
            }
          });
        } else if(measure !== song.length - 1 && noteIndex === song[measure].notes.length - 1) {
          this.setState({
            current: {
              measure: measure + 1,
              noteIndex: 0
            },
            timer: requestAnimationFrame(noteInterval)
          });
        } else {
          this.setState({
            current: {
              measure: measure,
              noteIndex: noteIndex + 1
            },
            timer: requestAnimationFrame(noteInterval)
          });
        }
      } else {
        this.setState({
          timer: requestAnimationFrame(noteInterval)
        });
      }
    };

    this.setState({
      timer: requestAnimationFrame(noteInterval)
    });
  }

  play = (startTime, delay, pitch, duration) => {
    let endTime = startTime + duration;

    let oscillator = this.state.audioContext.createOscillator();
    let gainNode = this.state.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.state.audioContext.destination);

    oscillator.type = 'square';
    oscillator.detune.value = (pitch - 29) * 100;

    gainNode.gain.value = 0.025;

    oscillator.start(startTime);
    oscillator.stop(endTime);
  }

  playNoteAtTime = (currentNote, playTime) => {
    for(let i = 0; i < currentNote.string.length; i++) {
      let pitch = currentNote.fret[i] + (5 * currentNote.string[i]);
      if(currentNote.string[i] >= 4) {
        pitch = pitch - 1;
      }

      this.play(playTime, 0, pitch, .5);
    }
  }

  handlePlay = (event) => {
    noteTime = 0.0;

    this.setState({
      isPlaying: true,
      startTime: this.state.audioContext.currentTime + .005,
    }, () => {
      this.changeNotes(0, 0);
      this.schedule();
    });
  }

  schedule = () => {
    let currentTime = this.state.audioContext.currentTime - this.state.startTime;

    while(noteTime < currentTime + 0.200) {
      let contextPlayTime = noteTime + this.state.startTime;
      let { measure, noteIndex } = currentPlayingIndex;

      if(measure === 'NO') {
        return;
      }

      let noteToPlay = song[measure].notes[noteIndex];

      this.playNoteAtTime(noteToPlay, contextPlayTime);
      currentPlayingIndex = this.advanceNote(measure, noteIndex);
    }
    requestId = requestAnimationFrame(this.schedule);
  }

  advanceNote = (measure, noteIndex) => {
    let tempo = 60.0;
    let secondsPerBeat = 60.0 / tempo;
    noteTime = noteTime + (0.5 * secondsPerBeat);

    if(measure === song.length - 1 && noteIndex === song[measure].notes.length - 1) {
      return {
        measure: 'NO',
        noteIndex: 0
      };
    } else if(measure !== song.length - 1 && noteIndex === song[measure].notes.length - 1) {
      return {
        measure: measure + 1,
        noteIndex: 0
      };
    } else {
      return {
        measure: measure,
        noteIndex: noteIndex + 1
      };
    }
  }

  handleStop = () => {
    cancelAnimationFrame(requestId);
  }

  bpmChanged = (event) => {
    this.setState({
      speed: 60000 / event.target.value
    });
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '50' }}>
          BPM:
          <input onChange={this.bpmChanged} />
          <button onClick={this.handlePlay.bind(this, song)}>Play</button>
        </div>
        <TabStaff song={song} currentNote={this.state.current} isPlaying={this.state.isPlaying} />
      </div>
    );
  }
}
