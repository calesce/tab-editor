import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as Actions from '../actions/playingNote';
import { playCurrentNote, getReplaySpeedForNote } from '../util/audio';

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

  loopThroughSong = (startTimestamp, playingNote, track, isCurrent, trackIndex) => {
    if(!startTimestamp) {
      startTimestamp = Date.now();
    }

    const { measure, noteIndex } = playingNote;
    const { measures } = track;

    const currentTimestamp = Date.now();
    const replayDiff = currentTimestamp - startTimestamp;

    const measureToPlay = measures[measure];
    const bpm = measureToPlay.bpm;

    let replaySpeed;
    if(measureToPlay.notes.length > 0) {
      replaySpeed = getReplaySpeedForNote(measureToPlay.notes[noteIndex], bpm);
    } else {
      replaySpeed = bpm * 4;
    }

    if(replayDiff >= replaySpeed) {
      if(measure === measures.length - 1 && noteIndex >= measures[measure].notes.length - 1) {
        this.props.actions.setPlayingNote(null);
      } else if(measure !== measures.length - 1 && noteIndex >= measures[measure].notes.length - 1) {
        const newPlayingNote = {
          measure: measure + 1,
          noteIndex: 0
        };
        playCurrentNote(track, newPlayingNote, this.props.buffers);
        if(isCurrent) {
          this.updateNote(newPlayingNote);
        }
        this.timers[trackIndex] = requestAnimationFrame(() => {
          this.loopThroughSong(currentTimestamp, newPlayingNote, track, isCurrent, trackIndex);
        });
      } else {
        const newPlayingNote = {
          measure,
          noteIndex: noteIndex + 1
        };
        playCurrentNote(track, newPlayingNote, this.props.buffers);
        if(isCurrent) {
          this.updateNote(newPlayingNote);
        }
        this.timers[trackIndex] = requestAnimationFrame(() => {
          this.loopThroughSong(currentTimestamp, newPlayingNote, track, isCurrent, trackIndex);
        });
      }
    } else {
      this.timers[trackIndex] = requestAnimationFrame(() => {
        this.loopThroughSong(startTimestamp, playingNote, track, isCurrent, trackIndex);
      });
    }
  };

  startPlayback = () => {
    const { buffers, tracks, currentTrackIndex } = this.props;

    const playingNote = _.cloneDeep(this.props.playingNote);
    this.props.tracks.map((track) => {
      playCurrentNote(track, playingNote, buffers);
    });

    tracks.map((track, i) => {
      this.timers[i] = requestAnimationFrame(() => {
        this.loopThroughSong(null, playingNote, track, i === currentTrackIndex, i);
      });
    });
  };

  updateNote = (playingNote) => {
    _.defer(() => {
      this.props.actions.setPlayingNote(playingNote);
    });
  };

  render() {
    return <div style={{ display: 'none' }}></div>;
  }
}

function mapStateToProps(state) {
  return {
    tracks: state.tracks,
    currentTrackIndex: state.currentTrackIndex,
    playingNote: state.playingNote
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Playback);
