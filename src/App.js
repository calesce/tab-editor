import React, { Component } from 'react';
import { randomScale } from './randomScale';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scale: randomScale(),
      currentNote: 0,
      audioContext: new AudioContext()
    };
  }

  componentDidMount() {
    this.playSequence();
  }

  playSequence = () => {
    var a = setInterval(() => {
      var note = this.state.scale[this.state.currentNote];

      this.play(0, this.getNote(note), 0.5);

      if(this.state.currentNote === this.state.scale.length-1) {
        clearInterval(a);
      }

      this.setState({
        currentNote: this.state.currentNote + 1
      });
    }, 500);
  }

  getNote(note) {
    switch(note) {
      case 'a':
        return 0;
      case 'ais':
        return 1;
      case 'b':
        return 2;
      case 'c':
        return 3;
      case 'cis':
        return 4;
      case 'd':
        return 5;
      case 'dis':
        return 6;
      case 'e':
        return 7;
      case 'f':
        return 8;
      case 'fis':
        return 9;
      case 'g':
        return 10;
      case 'gis':
        return 11;
    }
  }

  play = (delay, pitch, duration) => {

    console.log('pitch: ' + pitch);
    var startTime = this.state.audioContext.currentTime + delay
    var endTime = startTime + duration

    var oscillator = this.state.audioContext.createOscillator()
    oscillator.connect(this.state.audioContext.destination)

    oscillator.type = 'square'
    oscillator.detune.value = pitch * 100

    oscillator.start(startTime)
    oscillator.stop(endTime)
  }

  newSong= () => {
    this.setState({
      scale: randomScale(),
      currentNote: 0
    });

    this.playSequence();
  }

  render() {
    return (
      <div style={{ color: 'red' }}>
        <h1>{JSON.stringify(this.state.scale)}</h1>
        HAIL SATAN
        <button onClick={this.newSong}>Play</button>
      </div>
    );
  }
}
