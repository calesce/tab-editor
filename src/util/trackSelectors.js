import { createSelector } from 'reselect';
import { findIndex, omit } from 'lodash';
import { playingIndexSelector } from './selectors';

export const getTracksSelector = state => ({ tracks: state.tracks.present });
const tracksSelector = state => state.tracks.present;
const currentTrackIndexSelector = state => state.currentTrackIndex;

const getRepeatingSection = (measures, repeatBegin, repeatEnd) => {
  return measures.slice(0, repeatBegin).concat(omit(measures[repeatEnd], 'repeatEnd'));
};

const mapMeasureIndices = measures => {
  return measures.map((measure, i) => {
    return {
      ...measure,
      measureIndex: i
    };
  });
};

const tracksWithMeasuresSelector = createSelector(
  tracksSelector,
  tracks => {
    return tracks.map((track) => ({
      ...track,
      measures: mapMeasureIndices(track.measures)
    }));
  }
);

// recursive function to "unwind" all of the repeat signs in a song to give the actual notes to be played
const expandedTracksFromMeasures = tracks => {
  const repeatIndex = findIndex(tracks[0].measures, (measure) => measure.repeatEnd === true);
  if(repeatIndex === -1) {
    return tracks;
  }
  const expandedTracks = tracks.map(track => {
    const { measures } = track;
    const repeatSection = getRepeatingSection(measures, repeatIndex);
    const newMeasures = measures.slice(0, repeatIndex)
      .concat(omit(measures[repeatIndex], 'repeatEnd'))
      .concat(repeatSection)
      .concat(measures.slice(repeatIndex + 1, measures.length));

    return {
      ...track,
      measures: newMeasures
    };
  });
  return expandedTracksFromMeasures(expandedTracks);
};

const getExpandedPlayingIndex = (measures, originalPlayingIndex) => {
  return {
    ...originalPlayingIndex,
    measureIndex: findIndex(measures, measure =>
      measure.measureIndex === originalPlayingIndex.measureIndex
    )
  };
};

export const expandedTracksSelector = createSelector(
  [tracksWithMeasuresSelector, playingIndexSelector, currentTrackIndexSelector],
  (tracks, playingIndex, currentTrackIndex) => {
    const expandedTracks = expandedTracksFromMeasures(tracks);

    return {
      playingIndex: getExpandedPlayingIndex(expandedTracks[currentTrackIndex].measures, playingIndex),
      currentTrackIndex,
      expandedTracks
    };
  }
);
