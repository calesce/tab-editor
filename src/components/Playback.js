import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setPlayingIndex } from '../actions/playingIndex';
import { playCurrentNoteAtTime} from '../util/audio';
import { getBpmForNote, getBpmForNote1, getPercentageOfNote, getBpmOfPercentage } from '../util/audioMath';
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

  advanceNote(playingIndex, measures, visibleTrackIndex) {
    const { measureIndex, noteIndex } = playingIndex;

    const measure = measures[measureIndex];
    const note = measure[noteIndex][0];
    const lastMeasure = measures.length - 1;
    const lastNote = measures[measureIndex].length - 1;

    measure[noteIndex].forEach(note => {
      if(note.trackIndex === visibleTrackIndex) {
        this.updateNote({
          measureIndex,
          noteIndex: note.originalNoteIndex
        });
      }
    });

    let replaySpeed;
    if(noteIndex === lastNote) {
      replaySpeed = getBpmForNote(note, note.bpm);
    } else {
      const nextPosition = noteIndex === lastNote ? 1.0 : measure[noteIndex + 1][0].position;
      const positionDiff = nextPosition - note.position;
      replaySpeed = getBpmForNote1(getBpmOfPercentage(positionDiff, note.timeSignature), note.bpm);
    }

    this.noteTime = this.noteTime + (60.0 / replaySpeed);

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

  createScheduleForMeasure(tracks, measureIndex) {
    // the measure will be an an array of arrays, for the same measure for each track
    // let's use a reduce() function that outputs an object
    // with each note schedule for each time "bucket" for the measure
    // if there are multiple tracks with notes in the same "bucket",
    // the value will be an array (like a chord but with each instrument)
    // then just turn that object into an array to be consumed by the scheduler
    // one question is do we want to do this in the lookahead interval (0.2)
    // or run this entire process (could be expensive) before starting playback
    // I think we'll start with the latter
    const measures = tracks.reduce((accum, track, trackIndex) => {
      const measure = track.measures[measureIndex];

      const noteBuckets = measure.notes.reduce((bucket, note, noteIndex) => {
        const percentage = getPercentageOfNote(note.duration, measure.timeSignature);

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

    const scheduledMeasure = measures.reduce((accum, measure) => {
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

    if(measureIndex === 4) {
      console.log(measures);
    }

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
