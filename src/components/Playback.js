import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as Actions from '../actions/playingIndex';
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

  loopThroughSong = (startTimestamp, playingIndex, track, isCurrent, trackIndex) => {
    if(!startTimestamp) {
      startTimestamp = Date.now();
    }

    const { measureIndex, noteIndex } = playingIndex;
    const { measures } = track;

    const currentTimestamp = Date.now();
    const replayDiff = currentTimestamp - startTimestamp;

    const measureToPlay = measures[measureIndex];
    const bpm = measureToPlay.bpm;

    let replaySpeed;
    if(measureToPlay.notes.length > 0) {
      replaySpeed = getReplaySpeedForNote(measureToPlay.notes[noteIndex], bpm);
    } else {
      replaySpeed = bpm * 4;
    }

    if(replayDiff >= replaySpeed) {
      if(measureIndex === measures.length - 1 && noteIndex >= measures[measureIndex].notes.length - 1) {
        this.props.actions.setPlayingIndex(null);
      } else if(measureIndex !== measures.length - 1 && noteIndex >= measures[measureIndex].notes.length - 1) {
        const newPlayingIndex = {
          measureIndex: measureIndex + 1,
          noteIndex: 0
        };
        playCurrentNote(track, newPlayingIndex, this.props.buffers[track.instrument]);
        if(isCurrent) {
          this.updateNote({
            measureIndex: measureToPlay.measureIndex + 1,
            noteIndex: 0
          });
        }
        this.timers[trackIndex] = requestAnimationFrame(() => {
          this.loopThroughSong(currentTimestamp, newPlayingIndex, track, isCurrent, trackIndex);
        });
      } else {
        const newPlayingIndex = {
          measureIndex,
          noteIndex: noteIndex + 1
        };
        playCurrentNote(track, newPlayingIndex, this.props.buffers[track.instrument]);
        if(isCurrent) {
          this.updateNote({
            measureIndex: measureToPlay.measureIndex,
            noteIndex: newPlayingIndex.noteIndex
          });
        }
        this.timers[trackIndex] = requestAnimationFrame(() => {
          this.loopThroughSong(currentTimestamp, newPlayingIndex, track, isCurrent, trackIndex);
        });
      }
    } else {
      this.timers[trackIndex] = requestAnimationFrame(() => {
        this.loopThroughSong(startTimestamp, playingIndex, track, isCurrent, trackIndex);
      });
    }
  };

  getRepeatingSection = (measures, repeatIndex) => {
    return repeatIndex === -1 ? [] : measures.slice(0, repeatIndex + 1);
  };

  mapMeasureIndices = (measures) => {
    return measures.map((measure, i) => {
      return {
        ...measure,
        measureIndex: i
      };
    });
  };

  startPlayback = () => {
    const { buffers, tracks, currentTrackIndex } = this.props;

    const tracksWithMeasures = tracks.map((track) => {
      return {
        ...track,
        measures: this.mapMeasureIndices(track.measures)
      };
    });

    const repeatIndex = _.findIndex(tracksWithMeasures[0].measures, (measure) => measure.repeatEnd === true);

    let finalTracks;
    if(repeatIndex === -1) {
      finalTracks = tracksWithMeasures;
    } else {
      finalTracks = tracksWithMeasures.map((track) => {
        const { measures } = track;
        const repeatSection = this.getRepeatingSection(measures, repeatIndex);
        const newMeasures = measures.slice(0, repeatIndex + 1).concat(repeatSection).concat(measures.slice(repeatIndex + 1), measures.length);
        return {
          ...track,
          measures: newMeasures
        };
      });
    }

    const playingIndex = _.cloneDeep(this.props.playingIndex);
    finalTracks.map((track) => {
      playCurrentNote(track, playingIndex, buffers[track.instrument]);
    });

    finalTracks.map((track, i) => {
      this.timers[i] = requestAnimationFrame(() => {
        this.loopThroughSong(null, playingIndex, track, i === currentTrackIndex, i);
      });
    });
  };

  updateNote = (playingIndex) => {
    _.defer(() => {
      this.props.actions.setPlayingIndex(playingIndex);
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
    playingIndex: state.playingIndex
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Playback);
