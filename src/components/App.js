import React, { Component } from 'react';
import { randomScale, shuffle, toneRow } from '../util';
import Stave from './Stave';
import TabStaff from './TabStaff';
import _ from 'lodash';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scale: randomScale(),
      currentNote: 0,
      audioContext: new AudioContext(),
      isPlaying: false
    };
  }

  playSequence = (scale) => {
    this.setState({
      isPlaying: true
    }, () => {
      var a = setInterval(() => {
        var note = scale[this.state.currentNote];

        this.play(0, toneRow[note], 0.5);

        if(this.state.currentNote === scale.length-1) {
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

  play = (delay, pitch, duration) => {
    var startTime = this.state.audioContext.currentTime + delay;
    var endTime = startTime + duration;

    var oscillator = this.state.audioContext.createOscillator();
    var gainNode = this.state.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.state.audioContext.destination);

    oscillator.type = 'square';
    oscillator.detune.value = (pitch + 3) * 100;

    gainNode.gain.value = 0.025;

    oscillator.start(startTime);
    oscillator.stop(endTime);
  }

  newScale = () => {
    this.setState({
      scale: randomScale(),
      shuffledScale: [],
      format: 'ascending',
      currentNote: 0,
      isPlaying: false
    });
  }

  setShuffle = () => {
    let currentScale = _.clone(this.state.scale);
    this.setState({
      shuffledScale: shuffle(currentScale),
      format: 'shuffle'
    });
  }

  setDescending = () => {
    let scale = _.clone(this.state.scale);
    scale.reverse();
    return scale;
  }

  setFullScale = () => {
    let scale = _.clone(this.state.scale);
    let descending = _.clone(this.state.scale);
    descending.reverse();
    descending.shift();

    return scale.concat(descending);
  }

  getScaleFromFormat = (format) => {
    switch(format) {
      case 'descending':
        return this.setDescending();
        break;
      case 'shuffle':
        return this.state.shuffledScale;
        break;
      case 'full':
        return this.setFullScale();
        break;
      default:
        return this.state.scale;
        break;
    }
  };

  setFormat = (event) => {
    this.setState({
      format: event.target.name
    });
  }

  render() {
    let scale = this.getScaleFromFormat(this.state.format);

    return (
      <div style={{ color: 'red' }}>
        <h1>{JSON.stringify(scale)}</h1>
        <button onClick={this.newScale}>New Scale</button>
        <button name='shuffle' onClick={this.setShuffle}>Shuffle Baby</button>
        <button name='ascending' onClick={this.setFormat}>Ascending</button>
        <button name='descending' onClick={this.setFormat}>Descending</button>
        <button name='full' onClick={this.setFormat}>Full Scale</button>
        <button onClick={this.playSequence.bind(this, scale)}>Play</button>
        <br />
        <Stave scale={scale} currentNoteIndex={this.state.currentNote} isPlaying={this.state.isPlaying} />
        <TabStaff notes={scale} currentNoteIndex={this.state.currentNote} isPlaying={this.state.isPlaying} />
      </div>
    );
  }
}
