import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defer } from 'lodash';

import * as Actions from '../actions/playingIndex';
import { playCurrentNote, getReplaySpeedForNote } from '../util/audio';
import { expandedTracksSelector } from '../util/trackSelectors';

class Playback extends Component {
  constructor(props) {
    super(props);
    this.timers = [];
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillMount() {
    this.startPlayback();
  }

  componentWillUnmount() {
    this.timers.map((timer) => {
      cancelAnimationFrame(timer);
    });
  }

  loopThroughSong = (startTimestamp, playingIndex, track, visibleTrackIndex, trackIndex) => {
    const { measureIndex, noteIndex } = playingIndex;
    const { measures } = track;
    const measureToPlay = measures[measureIndex];

    const currentTimestamp = Date.now();
    const replaySpeed = getReplaySpeedForNote(measureToPlay.notes, noteIndex, measureToPlay.bpm);

    if(currentTimestamp - startTimestamp >= replaySpeed) {
      if(measureIndex === measures.length - 1 && noteIndex >= measureToPlay.notes.length - 1) {
        this.props.actions.setPlayingIndex(null);
      } else if(measureIndex !== measures.length - 1 && noteIndex >= measureToPlay.notes.length - 1) {
        const newPlayingIndex = {
          measureIndex: measureIndex + 1,
          noteIndex: 0
        };
        playCurrentNote(track, newPlayingIndex, this.props.buffers[track.instrument]);
        if(visibleTrackIndex === trackIndex) {
          this.updateUI(measures, measureToPlay, noteIndex, measureIndex);
        }
        this.timers[trackIndex] = requestAnimationFrame(() => {
          this.loopThroughSong(currentTimestamp, newPlayingIndex, track, visibleTrackIndex, trackIndex);
        });
      } else if(noteIndex < measureToPlay.notes.length - 1){
        const newPlayingIndex = {
          measureIndex,
          noteIndex: noteIndex + 1
        };
        playCurrentNote(track, newPlayingIndex, this.props.buffers[track.instrument]);
        if(visibleTrackIndex === trackIndex) {
          this.updateUI(measures, measureToPlay, noteIndex, measureIndex);
        }
        this.timers[trackIndex] = requestAnimationFrame(() => {
          this.loopThroughSong(currentTimestamp, newPlayingIndex, track, visibleTrackIndex, trackIndex);
        });
      }
    } else {
      this.timers[trackIndex] = requestAnimationFrame(() => {
        this.loopThroughSong(startTimestamp, playingIndex, track, visibleTrackIndex, trackIndex);
      });
    }
  };

  updateUI = (measures, measure, noteIndex, playbackMeasureIndex) => {
    if(measure.measureIndex !== measures.length - 1 && noteIndex >= measure.notes.length - 1) {
      this.updateNote({
        measureIndex: measures[playbackMeasureIndex + 1].measureIndex,
        noteIndex: 0
      });
    } else {
      this.updateNote({
        measureIndex: measure.measureIndex,
        noteIndex: noteIndex + 1
      });
    }
  };

  startPlayback = () => {
    const { buffers, currentTrackIndex, playingIndex, expandedTracks } = this.props;

    expandedTracks.forEach((track) => {
      playCurrentNote(track, playingIndex, buffers[track.instrument]);
    });

    expandedTracks.forEach((track, i) => {
      this.timers[i] = requestAnimationFrame(() => {
        this.loopThroughSong(Date.now(), playingIndex, track, currentTrackIndex, i);
      });
    });
  };

  updateNote = (playingIndex) => {
    defer(() => {
      this.props.actions.setPlayingIndex(playingIndex);
    });
  };

  render() {
    return <div style={{ display: 'none' }}></div>;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(expandedTracksSelector, mapDispatchToProps)(Playback);
