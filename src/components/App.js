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
      currentNote: 0,
      audioContext: new AudioContext(),
      isPlaying: false,
      speed: 500
    };
  }

  playSequence = (song) => {
    this.setState({
      isPlaying: true
    }, () => {
      var interval = setInterval(() => {
        var note = song[this.state.currentNote];

        for(let i = 0; i < note.string.length; i++) {
          let pitch = note.fret[i] + (5 * note.string[i]);
          if(note.string[i] >= 4) {
            pitch = pitch - 1;
          }

          this.play(0, pitch, this.state.speed / 1000);
        }

        if(this.state.currentNote === song.length - 1) {
          clearInterval(interval);

          setTimeout(() => {
            this.setState({
              isPlaying: false,
              currentNote: 0
            });
          }, this.state.speed);
        }

        this.setState({
          currentNote: this.state.currentNote + 1
        });
      }, this.state.speed);
    });
  }

  play = (delay, pitch, duration) => {
    var startTime = this.state.audioContext.currentTime + delay;
    var endTime = startTime + duration;

    var oscillator = this.state.audioContext.createOscillator();
    var gainNode = this.state.audioContext.createGain();
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
      <div style={{ color: 'red' }}>
        <button onClick={this.playSequence.bind(this, song)}>Play</button>
        <br />
        <br />
        BPM:
        <input onChange={this.bpmChanged} />
        <br />
        <br />
        <br />
        <TabStaff notes={song} currentNoteIndex={this.state.currentNote} isPlaying={this.state.isPlaying} />
      </div>
    );
  }
}
