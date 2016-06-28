import { createSelector } from 'reselect';
import { findIndex } from 'lodash';
import { playingIndexSelector, selectRangeSelector } from './selectors';

export const getTracksSelector = state => ({ tracks: state.tracks.present });
const tracksSelector = state => state.tracks.present;
const currentTrackIndexSelector = state => state.currentTrackIndex;

const getRepeatingSection = (measures, repeatIndex) => {
  return repeatIndex === -1 ? [] : measures.slice(0, repeatIndex + 1);
};

const mapMeasureIndices = (measures) => {
  return measures.map((measure, i) => {
    return {
      ...measure,
      measureIndex: i
    };
  });
};

const tracksWithMeasuresSelector = createSelector(
  tracksSelector,
  (tracks) => {
    return tracks.map((track) => {
      return {
        ...track,
        measures: mapMeasureIndices(track.measures)
      };
    });
  }
);

const expandedTracksFromMeasures = (tracks, repeatIndex) => {
  if(repeatIndex === -1) {
    return tracks;
  }
  return tracks.map((track) => {
    const { measures } = track;
    const repeatSection = getRepeatingSection(measures, repeatIndex);
    const newMeasures = measures.slice(0, repeatIndex + 1).concat(repeatSection).concat(measures.slice(repeatIndex + 1, measures.length));
    return {
      ...track,
      measures: newMeasures
    };
  });
};

const getSectionOfTrack = (selection, tracks, currentTrackIndex) => {
  return tracks.map((track, trackIndex) => {
    return track.measures.filter(measure => {
      if(selection[measure.measureIndex]) {
        return true;
      }
      return false;
    });
  });
};

export const expandedTracksSelector = createSelector(
  tracksWithMeasuresSelector,
  playingIndexSelector,
  currentTrackIndexSelector,
  selectRangeSelector,
  (tracksWithMeasures, playingIndex, currentTrackIndex, selectRange) => {
    const repeatIndex = findIndex(tracksWithMeasures[0].measures, (measure) => measure.repeatEnd === true);
    const expandedTracks = expandedTracksFromMeasures(tracksWithMeasures, repeatIndex);

    const newMeasureIndex = findIndex(expandedTracks[currentTrackIndex].measures, (measure) =>
      measure.measureIndex === playingIndex.measureIndex
    );
    const newPlayingIndex = {
      measureIndex: newMeasureIndex,
      noteIndex: playingIndex.noteIndex
    };

    const slicedTracks = selectRange ? getSectionOfTrack(selectRange, expandedTracks, currentTrackIndex) : undefined;

    return {
      playingIndex: newPlayingIndex,
      currentTrackIndex,
      expandedTracks,
      slicedTracks
    };
  }
);
