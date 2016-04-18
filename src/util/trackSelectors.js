import { createSelector } from 'reselect';
import { findIndex } from 'lodash';
import { playingIndexSelector, selectRangeSelector } from './selectors';

const tracksSelector = state => state.tracks;
const currentTrackIndexSelector = state => state.currentTrackIndex;

const expandedTracksFromMeasures = (tracks, repeatIndex) => {
  if(repeatIndex === -1) {
    return tracks;
  }
  return tracks.map((track) => {
    const { measures } = track;
    const repeatSection = getRepeatingSection(measures, repeatIndex);
    const newMeasures = measures.slice(0, repeatIndex + 1).concat(repeatSection).concat(measures.slice(repeatIndex + 1), measures.length);
    return {
      ...track,
      measures: newMeasures
    };
  });
};

const getRepeatingSection = (measures, repeatIndex) => {
  return repeatIndex === -1 ? [] : measures.slice(0, repeatIndex + 1);
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

const mapMeasureIndices = (measures) => {
  return measures.map((measure, i) => {
    return {
      ...measure,
      measureIndex: i
    };
  });
};

export const expandedTracksSelector = createSelector(
  tracksSelector,
  tracksWithMeasuresSelector,
  playingIndexSelector,
  currentTrackIndexSelector,
  selectRangeSelector,
  (tracks, tracksWithMeasures, playingIndex, currentTrackIndex, selectRange) => {

    const repeatIndex = findIndex(tracksWithMeasures[0].measures, (measure) => measure.repeatEnd === true);
    const expandedTracks = expandedTracksFromMeasures(tracksWithMeasures, repeatIndex);

    const newMeasureIndex = findIndex(expandedTracks[currentTrackIndex].measures, (measure) =>
      measure.measureIndex === playingIndex.measureIndex
    );
    const newPlayingIndex = {
      measureIndex: newMeasureIndex,
      noteIndex: playingIndex.noteIndex
    };

    return {
      playingIndex: newPlayingIndex,
      tracks,
      currentTrackIndex,
      expandedTracks,
      selectRange
    };
  }
);
