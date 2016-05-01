import React, { Component } from 'react';
import { connect } from 'react-redux';

import { playWithBuffer } from '../util/audio';
import { expandedTracksSelector } from '../util/trackSelectors';
import audioContext from '../util/audioContext';

class Playback extends Component {
  constructor(props) {
    super(props);

    this.schedule = this.schedule.bind(this);
    this.advanceNote = this.advanceNote.bind(this);
    this.startPlayback = this.startPlayback.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillMount() {
    this.startTime = audioContext.currentTime + .005;
    this.noteTime = 0.0;
    this.startPlayback();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.requestId);
  }

  schedule(track, playingIndex) {
    while(this.noteTime < audioContext.currentTime - this.startTime + 0.200) {
      if(playingIndex === false) {
        return;
      }
      const contextPlayTime = this.noteTime + this.startTime;

      playWithBuffer(this.props.buffers[60], 0.1, contextPlayTime);
      playingIndex = this.advanceNote(playingIndex, track);
    }
    this.requestId = requestAnimationFrame(() => {
      this.schedule(track, playingIndex);
    });
  }

  advanceNote({ measureIndex, noteIndex }, track) {
    const measure = track.measures[measureIndex];
    this.noteTime = this.noteTime + (60.0 / measure.bpm);

    if(measureIndex !== track.measures.length - 1 && noteIndex >= measure.timeSignature.beats) {
      return {
        measureIndex: measureIndex + 1,
        noteIndex: 0
      };
    } else if(noteIndex < measure.timeSignature.beats) {
      return {
        measureIndex,
        noteIndex: noteIndex + 1
      };
    }
    return false;
  }

  startPlayback() {
    this.schedule(this.props.expandedTracks[0], this.props.playingIndex);
  }

  render() {
    return <div style={{ display: 'none' }}></div>;
  }
}

export default connect(expandedTracksSelector)(Playback);
