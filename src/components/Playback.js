import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';
import { flatten } from 'lodash';

import { setPlayingIndex } from '../actions/playingIndex';
import { setCursor } from '../actions/cursor';

import { playCurrentNoteAtTime } from '../util/audio';
import {
  createScheduleForSong,
  getReplaySpeed,
  getRealPlayingIndex,
  createCountdownSchedule
} from '../util/playbackSchedule';
import { expandedTracksSelector } from '../util/selectors/track';
import audioContext from '../util/audioContext';

const styles = StyleSheet.create({ none: { display: 'none' } });

class Playback extends Component {
  lastBuffers = [];

  shouldComponentUpdate() {
    return false;
  }

  componentWillMount() {
    this.startTime = audioContext.currentTime + 0.005;
    this.noteTime = 0.0;
    if (this.props.countdown) {
      this.startCountdown();
    } else {
      this.startPlayback();
    }
  }

  componentWillUnmount() {
    if (this.playingIndexCopy) {
      this.props.setCursor({ ...this.playingIndexCopy, stringIndex: 0 });
    }
    cancelAnimationFrame(this.requestId);
    if (this.lastBuffers) {
      this.lastBuffers.forEach(buffer => buffer.stop());
    }
  }

  schedule(measures, playingIndex, visibleTrackIndex, countdown) {
    while (this.noteTime < audioContext.currentTime - this.startTime + 0.2) {
      if (playingIndex === false) {
        if (countdown) {
          return this.startPlayback();
        } else {
          return this.props.setPlayingIndex(null);
        }
      }
      const contextPlayTime = this.noteTime + this.startTime;

      const { measureIndex, noteIndex } = playingIndex;

      measures[measureIndex][noteIndex].forEach(note => {
        this.lastBuffers = flatten(
          this.lastBuffers.concat(
            playCurrentNoteAtTime(
              note,
              contextPlayTime,
              this.props.buffers[note.instrument]
            )
          )
        ).filter(buffer => buffer);
      });
      playingIndex = this.advanceNote(
        playingIndex,
        measures,
        visibleTrackIndex
      );
    }
    this.requestId = requestAnimationFrame(() => {
      this.schedule(measures, playingIndex, visibleTrackIndex, countdown);
    });
  }

  advanceNote({ measureIndex, noteIndex }, measures, visibleTrackIndex) {
    const measure = measures[measureIndex];
    const lastNoteIndex = measures[measureIndex].length - 1;

    measure[noteIndex].forEach(note => {
      if (note.trackIndex === visibleTrackIndex) {
        this.props.setPlayingIndex({
          measureIndex: note.originalMeasureIndex,
          noteIndex: note.originalNoteIndex
        });
      }
    });

    this.noteTime =
      this.noteTime + 60.0 / getReplaySpeed(measure, noteIndex, lastNoteIndex);

    if (measureIndex === measures.length - 1 && noteIndex === lastNoteIndex) {
      return false;
    } else if (
      measureIndex !== measures.length - 1 &&
      noteIndex === lastNoteIndex
    ) {
      return { measureIndex: measureIndex + 1, noteIndex: 0 };
    } else {
      return { measureIndex, noteIndex: noteIndex + 1 };
    }
  }

  startPlayback() {
    const {
      currentTrackIndex,
      playingIndex,
      expandedTracks,
      metronome,
      countdown
    } = this.props;
    const scheduledSong = createScheduleForSong(
      expandedTracks,
      metronome,
      countdown
    );
    const realPlayingIndex = getRealPlayingIndex(
      this.playingIndexCopy || playingIndex,
      scheduledSong,
      currentTrackIndex
    );
    this.playingIndexCopy = null;

    this.requestId = requestAnimationFrame(() => {
      this.schedule(scheduledSong, realPlayingIndex, currentTrackIndex);
    });
  }

  startCountdown() {
    const { playingIndex, expandedTracks } = this.props;
    this.playingIndexCopy = {
      measureIndex: playingIndex.measureIndex,
      noteIndex: playingIndex.noteIndex
    };
    this.props.setPlayingIndex({
      measureIndex: playingIndex.measureIndex,
      noteIndex: -1
    });

    const countdownTrack = createCountdownSchedule(
      expandedTracks,
      playingIndex.measureIndex
    );

    this.requestId = requestAnimationFrame(() => {
      this.schedule(
        countdownTrack,
        { noteIndex: 0, measureIndex: 0 },
        -1,
        true
      );
    });
  }

  render() {
    return <div className={css(styles.none)} />;
  }
}

export default connect(expandedTracksSelector, { setPlayingIndex, setCursor })(
  Playback
);
