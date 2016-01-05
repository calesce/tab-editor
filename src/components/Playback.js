import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as Actions from '../actions/playingNote';
import { playCurrentNote, getReplaySpeedForNote } from '../util/audio';

class Playback extends Component {
  componentWillMount = () => {
    this.startPlayback();
  }

  componentWillUnmount = () => {
    cancelAnimationFrame(this.state.timer);
  }

  loopThroughSong = (startTimestamp, playingNote) => {
    if(!startTimestamp) {
      startTimestamp = Date.now();
    }

    let { measure, noteIndex } = playingNote;
    let { measures } = this.props.track;

    let currentTimestamp = Date.now();
    let replayDiff = currentTimestamp - startTimestamp;

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
        playCurrentNote(this.props.track, newPlayingNote, this.props.buffers);
        this.props.actions.setPlayingNote(newPlayingNote);
        this.setState({
          timer: requestAnimationFrame(() => {
            this.loopThroughSong(currentTimestamp, newPlayingNote);
          })
        });
      } else {
        const newPlayingNote = {
          measure,
          noteIndex: noteIndex + 1
        };
        playCurrentNote(this.props.track, newPlayingNote, this.props.buffers);
        this.props.actions.setPlayingNote(newPlayingNote);
        this.setState({
          timer: requestAnimationFrame(() => {
            this.loopThroughSong(currentTimestamp, newPlayingNote);
          })
        });
      }
    } else {
      this.setState({
        timer: requestAnimationFrame(() => {
          this.loopThroughSong(startTimestamp, playingNote);
        })
      });
    }
  }

  startPlayback = () => {
    const playingNote = _.cloneDeep(this.props.playingNote);
    playCurrentNote(this.props.track, playingNote, this.props.buffers);

    this.setState({
      timer: requestAnimationFrame(() => {
        this.loopThroughSong(null, playingNote);
      })
    });
  }

  render() {
    return <div style={{ display: 'none' }}></div>;
  }
}

function mapStateToProps(state) {
  return {
    track: state.tracks[state.currentTrackIndex],
    playingNote: state.playingNote
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Playback);
