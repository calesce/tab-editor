import React, { Component } from 'react';
import { randomScale } from './randomScale';
import Stave from './Stave';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scale: randomScale(),
      currentNote: 0,
      audioContext: new AudioContext()
    };
  }

  playSequence = () => {
    this.setState({
      isPlaying: true
    }, () => {
      var a = setInterval(() => {
        var note = this.state.scale[this.state.currentNote];

        this.play(0, this.getNote(note), 0.5);

        if(this.state.currentNote === this.state.scale.length-1) {
          clearInterval(a);

          setTimeout(() => {
            this.setState({
              isPlaying: false,
              currentNote: 0
            });
          }, 500);
        }

        this.setState({
          currentNote: this.state.currentNote + 1
        });
      }, 500);
    });
  }

  getNote(note) {
    switch(note) {
      case 'c':
        return 0;
      case 'cis':
        return 1;
      case 'd':
        return 2;
      case 'dis':
        return 3;
      case 'e':
        return 4;
      case 'f':
        return 5;
      case 'fis':
        return 6;
      case 'g':
        return 7;
      case 'gis':
        return 8;
      case 'a':
        return 9;
      case 'ais':
        return 10;
      case 'b':
        return 11;
    }
  }

  play = (delay, pitch, duration) => {
    var startTime = this.state.audioContext.currentTime + delay;
    var endTime = startTime + duration;

    var oscillator = this.state.audioContext.createOscillator();
    var gainNode = this.state.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.state.audioContext.destination);

    oscillator.type = 'square';
    oscillator.detune.value = pitch * 100;

    gainNode.gain.value = 0.025;

    oscillator.start(startTime);
    oscillator.stop(endTime);
  }

  newScale = () => {
    this.setState({
      scale: randomScale(),
      currentNote: 0,
      isPlaying: false
    });
  }

  render() {
    return (
      <div style={{ color: 'red' }}>
        <h1>{JSON.stringify(this.state.scale)}</h1>
        <button onClick={this.newScale}>New Scale</button>
        <button onClick={this.playSequence}>Play</button>
        <br />
        <Stave scale={this.state.scale} currentNoteIndex={this.state.currentNote} isPlaying={this.state.isPlaying} />
      </div>
    );
  }
}
