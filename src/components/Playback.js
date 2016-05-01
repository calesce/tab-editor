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

  schedule(tracks, playingIndex, visibleTrackIndex) {
    while(this.noteTime < audioContext.currentTime - this.startTime + 0.200) {
      if(playingIndex === false) {
        return this.props.setPlayingIndex(null);
      }
      const contextPlayTime = this.noteTime + this.startTime;

      const track = tracks[playingIndex.trackIndex];
      playCurrentNoteAtTime(track, playingIndex, this.props.buffers[track.instrument], contextPlayTime);
      playingIndex = this.advanceNote(playingIndex, tracks, playingIndex.trackIndex === visibleTrackIndex, this);
    }
    this.requestId = requestAnimationFrame(() => {
      this.schedule(tracks, playingIndex, visibleTrackIndex);
    });
  }

  advanceNote(playingIndex, tracks, updateUI, context) {
    const { trackIndex, measureIndex, noteIndex } = playingIndex;
    if(updateUI) {
      context.updateNote({
        measureIndex: tracks[trackIndex].measures[measureIndex].measureIndex,
        noteIndex: playingIndex.noteIndex
      });
    }

    const track = tracks[trackIndex];
    const measure = track.measures[measureIndex];
    const replaySpeed = getBpmForNote(measure.notes, noteIndex, measure.bpm);
    context.noteTime = context.noteTime + (60.0 / replaySpeed);

    const lastMeasure = track.measures.length - 1;
    const lastNote = track.measures[measureIndex].notes.length - 1;

    if(measureIndex === lastMeasure && noteIndex === lastNote) {
      return false;
    } else if(measureIndex !== lastMeasure && noteIndex === lastNote) {
      return {
        ...playingIndex,
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
    this.requestId = requestAnimationFrame(() => {
      this.schedule(expandedTracks, { ...playingIndex, trackIndex: 0 }, currentTrackIndex);
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
