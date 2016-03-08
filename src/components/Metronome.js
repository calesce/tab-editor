import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getMetronomeSpeed, playWithBuffer } from '../util/audio';
import { expandedTracksSelector } from '../util/selectors';

class Playback extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillMount() {
    this.startPlayback();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.timer);
  }

  loopThroughSong = (startTimestamp, playingIndex, track) => {
    const { measureIndex, noteIndex } = playingIndex;
    const { measures } = track;
    const measureToPlay = measures[measureIndex];

    const numerator = parseInt(measureToPlay.timeSignature.split('/')[0]) - 1;
    const denominator = parseInt(measureToPlay.timeSignature.split('/')[1]);

    const currentTimestamp = Date.now();
    const replaySpeed = getMetronomeSpeed(measureToPlay.bpm, denominator);

    if(currentTimestamp - startTimestamp >= replaySpeed) {
      if(measureIndex !== measures.length - 1 && noteIndex >= numerator) {
        const newPlayingIndex = {
          measureIndex: measureIndex + 1,
          noteIndex: 0
        };
        playWithBuffer(this.props.buffers[60], 0.1);
        this.timer = requestAnimationFrame(() => {
          this.loopThroughSong(currentTimestamp, newPlayingIndex, track);
        });
      } else if(noteIndex < numerator){
        const newPlayingIndex = {
          measureIndex,
          noteIndex: noteIndex + 1
        };
        playWithBuffer(this.props.buffers[60], 0.1);
        this.timer = requestAnimationFrame(() => {
          this.loopThroughSong(currentTimestamp, newPlayingIndex, track);
        });
      }
    } else {
      this.timer = requestAnimationFrame(() => {
        this.loopThroughSong(startTimestamp, playingIndex, track);
      });
    }
  };

  startPlayback = () => {
    const { playingIndex, expandedTracks, buffers } = this.props;

    playWithBuffer(buffers[60], 0.1);

    this.timer = requestAnimationFrame(() => {
      this.loopThroughSong(Date.now(), playingIndex, expandedTracks[0]);
    });
  };

  render() {
    return <div style={{ display: 'none' }}></div>;
  }
}

export default connect(expandedTracksSelector)(Playback);
