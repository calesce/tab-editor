import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setPlayingIndex } from '../actions/playingIndex';
import { playCurrentNoteAtTime} from '../util/audio';
import { getBpmForNote, getPercentageOfNote, getDurationFromPercentage } from '../util/audioMath';
import { expandedTracksSelector } from '../util/trackSelectors';
import audioContext from '../util/audioContext';

class Playback extends Component {
  constructor(props) {
    super(props);

    this.schedule = this.schedule.bind(this);
    this.advanceNote = this.advanceNote.bind(this);
    this.createScheduleForMeasure = this.createScheduleForMeasure.bind(this);
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
          measureIndex,
          noteIndex: note.originalNoteIndex
        });
      }
    });

    this.noteTime = this.noteTime + (60.0 / this.getReplaySpeed(measure, noteIndex, lastNoteIndex));

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

  getReplaySpeed(measure, noteIndex, lastNoteIndex) {
    if(noteIndex === lastNoteIndex) {
      return Math.max(...measure[noteIndex].map(note => getBpmForNote(note.duration, note.bpm, note.dotted)));
    }

    const nextPosition = Math.min(...measure[noteIndex + 1].map(note => note.position));
    const positionDiff = nextPosition - measure[noteIndex][0].position;

    const speeds = measure[noteIndex].map(note => getBpmForNote(getDurationFromPercentage(positionDiff, note.timeSignature), note.bpm, false));
    const speed = Math.max(...speeds);
    return speed;
  }

  createScheduleForMeasure(tracks, measureIndex) {
    const annotatedMeasures = tracks.reduce((accum, track, trackIndex) => {
      const measure = track.measures[measureIndex];

      const noteBuckets = measure.notes.reduce((bucket, note, noteIndex) => {
        const percentage = getPercentageOfNote(note.duration, measure.timeSignature, note.dotted);

        const noteToUse = {
          ...note,
          originalNoteIndex: noteIndex,
          instrument: track.instrument,
          tuning: track.tuning,
          bpm: measure.bpm,
          timeSignature: measure.timeSignature,
          trackIndex,
          position: bucket.totalDuration
        };

        return {
          ...bucket,
          [(bucket.totalDuration).toString()]: noteToUse,
          totalDuration: bucket.totalDuration + percentage
        };
      }, { totalDuration: 0 });
      return accum.concat(noteBuckets);
    }, []);

    const scheduledMeasure = annotatedMeasures.reduce((accum, measure) => {
      Object.keys(measure).forEach(bucket => {
        if(bucket === 'totalDuration') {
          return accum;
        }
        if(accum[bucket]) {
          accum[bucket] = accum[bucket].concat(measure[bucket]);
        } else {
          accum[bucket] = [measure[bucket]];
        }
      });
      return accum;
    }, {});

    return Object.keys(scheduledMeasure).sort().map(timeSlot => {
      return scheduledMeasure[timeSlot];
    });
  }

  startPlayback() {
    const { currentTrackIndex, playingIndex, expandedTracks } = this.props;

    const scheduledMeasures = expandedTracks[0].measures.map((_, i) => {
      return this.createScheduleForMeasure(expandedTracks, i);
    });

    this.requestId = requestAnimationFrame(() => {
      this.schedule(scheduledMeasures, playingIndex, currentTrackIndex);
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
