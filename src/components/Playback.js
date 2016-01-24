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

  loopThroughSong = (startTimestamp, playingIndex, track, visibleTrackIndex, trackIndex) => {
    const { measureIndex, noteIndex } = playingIndex;
    const { measures } = track;
    const measureToPlay = measures[measureIndex];

    const currentTimestamp = Date.now();
    const replaySpeed = getReplaySpeedForNote(measureToPlay.notes, noteIndex, measureToPlay.bpm);

    if(currentTimestamp - startTimestamp >= replaySpeed) {
      if(measureIndex !== measures.length - 1 && noteIndex >= measureToPlay.notes.length - 1) {
        const newPlayingIndex = {
          measureIndex: measureIndex + 1,
          noteIndex: 0
        };
        playCurrentNote(track, newPlayingIndex, this.props.buffers[track.instrument]);
        this.timers[trackIndex] = requestAnimationFrame(() => {
          this.loopThroughSong(currentTimestamp, newPlayingIndex, track, visibleTrackIndex, trackIndex);
        });
      } else if(noteIndex < measureToPlay.notes.length - 1){
        const newPlayingIndex = {
          measureIndex,
          noteIndex: noteIndex + 1
        };
        playCurrentNote(track, newPlayingIndex, this.props.buffers[track.instrument]);
        this.timers[trackIndex] = requestAnimationFrame(() => {
          this.loopThroughSong(currentTimestamp, newPlayingIndex, track, visibleTrackIndex, trackIndex);
        });
      }

      if(visibleTrackIndex === trackIndex) {
        this.updateUI(measures, measureToPlay, noteIndex, measureIndex);
      }
    } else {
      this.timers[trackIndex] = requestAnimationFrame(() => {
        this.loopThroughSong(startTimestamp, playingIndex, track, visibleTrackIndex, trackIndex);
      });
    }
  };

  updateUI = (measures, measure, noteIndex, playbackMeasureIndex) => {
    if(measure.measureIndex === measures.length - 1 && noteIndex >= measure.notes.length - 1) {
      this.props.actions.setPlayingIndex(null);
    } else if(measure.measureIndex !== measures.length - 1 && noteIndex >= measure.notes.length - 1) {
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
    const { buffers, tracks, currentTrackIndex, playingIndex } = this.props;

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

    const newMeasureIndex = _.findIndex(finalTracks[currentTrackIndex].measures, (measure) =>
      measure.measureIndex === playingIndex.measureIndex
    );
    const newPlayingIndex = {
      measureIndex: newMeasureIndex,
      noteIndex: playingIndex.noteIndex
    };

    finalTracks.map((track) => {
      playCurrentNote(track, newPlayingIndex, buffers[track.instrument]);
    });

    finalTracks.map((track, i) => {
      this.timers[i] = requestAnimationFrame(() => {
        this.loopThroughSong(Date.now(), newPlayingIndex, track, currentTrackIndex, i);
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
