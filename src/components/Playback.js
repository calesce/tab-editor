import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setPlayingIndex } from '../actions/playingIndex';
import { playCurrentNoteAtTime} from '../util/audio';
import { createScheduleForSong, getReplaySpeed, getRealPlayingIndex } from '../util/playbackSchedule';
import { expandedTracksSelector } from '../util/trackSelectors';
import audioContext from '../util/audioContext';

class Playback extends Component {
  constructor(props) {
    super(props);

    this.schedule = this.schedule.bind(this);
    this.advanceNote = this.advanceNote.bind(this);
    this.startPlayback = this.startPlayback.bind(this);
    this.updateNote = this.updateNote.bind(this);
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

  schedule(measures, playingIndex, visibleTrackIndex) {
    while(this.noteTime < audioContext.currentTime - this.startTime + 0.200) {
      if(playingIndex === false) {
        return this.props.setPlayingIndex(null);
      }
      const contextPlayTime = this.noteTime + this.startTime;

      const { measureIndex, noteIndex } = playingIndex;

      measures[measureIndex][noteIndex].forEach(note => {
        playCurrentNoteAtTime(note, contextPlayTime, this.props.buffers[note.instrument]);
      });
      playingIndex = this.advanceNote(playingIndex, measures, visibleTrackIndex, this);
    }
    this.requestId = requestAnimationFrame(() => {
      this.schedule(measures, playingIndex, visibleTrackIndex);
    });
  }

  advanceNote({ measureIndex, noteIndex }, measures, visibleTrackIndex) {
    const measure = measures[measureIndex];
    const lastNoteIndex = measures[measureIndex].length - 1;

    measure[noteIndex].forEach(note => {
      if(note.trackIndex === visibleTrackIndex) {
        this.updateNote({
          measureIndex: note.originalMeasureIndex,
          noteIndex: note.originalNoteIndex
        });
      }
    });

    this.noteTime = this.noteTime + (60.0 / getReplaySpeed(measure, noteIndex, lastNoteIndex));

    if(measureIndex === measures.length - 1 && noteIndex === lastNoteIndex) {
      return false;
    } else if(measureIndex !== measures.length - 1 && noteIndex === lastNoteIndex) {
      return {
        measureIndex: measureIndex + 1,
        noteIndex: 0
      };
    } else {
      return {
        measureIndex,
        noteIndex: noteIndex + 1
      };
    }
  }

  startPlayback() {
    const { currentTrackIndex, playingIndex, expandedTracks, metronome } = this.props;
    const scheduledSong = createScheduleForSong(expandedTracks, metronome);
    const realPlayingIndex = getRealPlayingIndex(playingIndex, scheduledSong, currentTrackIndex);

    this.requestId = requestAnimationFrame(() => {
      this.schedule(scheduledSong, realPlayingIndex, currentTrackIndex);
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
