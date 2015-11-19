import React, { Component } from 'react';
import Stave from './Stave';
import TabStaff from './TabStaff';
import _ from 'lodash';
import song from './song';

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
      speed: 500
    };
  }

  playSequence = (song) => {
    this.setState({
      isPlaying: true
    }, () => {
      let interval = setInterval(() => {
        let { current, speed } = this.state;
        let { measure, noteIndex } = current;

        let currentNote = song[measure].notes[noteIndex];

        for(let i = 0; i < currentNote.string.length; i++) {
          let pitch = currentNote.fret[i] + (5 * currentNote.string[i]);
          if(currentNote.string[i] >= 4) {
            pitch = pitch - 1;
          }

          this.play(0, pitch, speed / 1000);
        }

        if(measure === song.length - 1 && noteIndex === song[measure].notes.length - 1) {
          clearInterval(interval);

          setTimeout(() => {
            this.setState({
              isPlaying: false,
              current: {
                measure: 0,
                noteIndex: 0
              }
            });
          }, speed);
        } else if(measure !== song.length - 1 && noteIndex === song[measure].notes.length - 1) {
          this.setState({
            current: {
              measure: measure + 1,
              noteIndex: 0
            }
          });
        } else {
          this.setState({
            current: {
              measure,
              noteIndex: noteIndex + 1
            }
          });
        }
      }, this.state.speed);
    });
  }

  play = (delay, pitch, duration) => {
    let startTime = this.state.audioContext.currentTime + delay;
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
          <button onClick={this.playSequence.bind(this, song)}>Play</button>
        </div>
        <TabStaff song={song} currentNoteIndex={this.state.currentNote} isPlaying={this.state.isPlaying} />
      </div>
    );
  }
}
