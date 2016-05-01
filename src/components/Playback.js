import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setPlayingIndex } from '../actions/playingIndex';
import { playCurrentNoteAtTime} from '../util/audio';
import { getBpmForNote } from '../util/audioMath';
import { expandedTracksSelector } from '../util/trackSelectors';
import audioContext from '../util/audioContext';

class Playback extends Component {
  constructor(props) {
    super(props);

    this.schedule = this.schedule.bind(this);
    this.advanceNote = this.advanceNote.bind(this);
    this.startPlayback = this.startPlayback.bind(this);
    this.updateNote = this.updateNote.bind(this);

    this.requestIds = [];
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
    this.requestIds.map(requestId => {
      cancelAnimationFrame(requestId);
    });
  }

  schedule(track, playingIndex, visibleTrackIndex, trackIndex) {
    while(this.noteTime < audioContext.currentTime - this.startTime + 0.200) {
      if(playingIndex === false) {
        return this.props.setPlayingIndex(null);
      }
      const contextPlayTime = this.noteTime + this.startTime;

      playCurrentNoteAtTime(track, playingIndex, this.props.buffers[track.instrument], contextPlayTime);
      if(trackIndex === visibleTrackIndex) {
        this.updateNote({
          measureIndex: track.measures[playingIndex.measureIndex].measureIndex,
          noteIndex: playingIndex.noteIndex
        });
      }
      playingIndex = this.advanceNote(playingIndex, track, this);
    }
    this.requestIds[trackIndex] = requestAnimationFrame(() => {
      this.schedule(track, playingIndex, visibleTrackIndex, trackIndex);
    });
  }

  advanceNote(playingIndex, track, context) {
    const { measureIndex, noteIndex } = playingIndex;

    const measure = track.measures[measureIndex];
    const replaySpeed = getBpmForNote(measure.notes, noteIndex, measure.bpm);
    context.noteTime = context.noteTime + (60.0 / replaySpeed);

    const lastMeasure = track.measures.length - 1;
    const lastNote = track.measures[measureIndex].notes.length - 1;

    if(measureIndex === lastMeasure && noteIndex === lastNote) {
      return false;
    } else if(measureIndex !== lastMeasure && noteIndex === lastNote) {
      return {
        measureIndex: measureIndex + 1,
        noteIndex: 0
      };
    } else {
      return {
        ...playingIndex,
        noteIndex: noteIndex + 1
      };
    }
  }

  startPlayback() {
    const { currentTrackIndex, playingIndex, expandedTracks } = this.props;

    expandedTracks.forEach((track, i) => {
      this.requestIds[i] = requestAnimationFrame(() => {
        this.schedule(track, playingIndex, currentTrackIndex, i);
      });
    });
  }

  updateNote(playingIndex) {
    this.props.setPlayingIndex(playingIndex);
  }

  render() {
    return <div style={{ display: 'none' }}></div>;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setPlayingIndex: bindActionCreators(setPlayingIndex, dispatch)
  };
}

export default connect(expandedTracksSelector, mapDispatchToProps)(Playback);
