import { createSelector } from 'reselect';
import { findIndex, findLastIndex, omit } from 'lodash';
import { playingIndexSelector } from './index';

export const getTracksSelector = state => ({ tracks: state.tracks.present });
const tracksSelector = state => state.tracks.present;
const currentTrackIndexSelector = state => state.currentTrackIndex;

const mapMeasureIndices = measures => {
  return measures.map((measure, i) => {
    return { ...measure, measureIndex: i };
  });
};

const tracksWithMeasuresSelector = createSelector(tracksSelector, tracks => {
  return tracks.map(track => ({
    ...track,
    measures: mapMeasureIndices(track.measures)
  }));
});

const getRepeatingSection = (measures, repeatBegin, repeatEnd) => {
  if (repeatBegin === repeatEnd) {
    const repeatedMeasure = omit(measures[repeatEnd], [
      'repeatBegin',
      'repeatEnd'
    ]);
    return [repeatedMeasure];
  }
  return [omit(measures[repeatBegin], 'repeatBegin')]
    .concat(measures.slice(repeatBegin + 1, repeatEnd))
    .concat(omit(measures[repeatEnd], 'repeatEnd'));
};

const findMatchingRepeatBegin = measures => {
  const index = findLastIndex(
    measures,
    measure => measure.repeatBegin === true
  );
  return index > -1 ? index : 0;
};

// recursive function to "unwind" all of the repeat signs in a song to give the actual notes to be played
const expandedTracksFromMeasures = tracks => {
  const repeatEnd = findIndex(
    tracks[0].measures,
    measure => measure.repeatEnd === true
  );
  if (repeatEnd === -1) {
    return tracks;
  }
  const repeatBegin = findMatchingRepeatBegin(
    tracks[0].measures.slice(0, repeatEnd + 1)
  );

  const expandedTracks = tracks.map(track => {
    const { measures } = track;
    const repeatSection = getRepeatingSection(measures, repeatBegin, repeatEnd);
    const newMeasures = measures
      .slice(0, repeatBegin)
      .concat(repeatSection)
      .concat(repeatSection)
      .concat(measures.slice(repeatEnd + 1, measures.length));

    return { ...track, measures: newMeasures };
  });
  return expandedTracksFromMeasures(expandedTracks);
};

const getExpandedPlayingIndex = (measures, originalPlayingIndex) => {
  return {
    ...originalPlayingIndex,
    measureIndex: findIndex(
      measures,
      measure => measure.measureIndex === originalPlayingIndex.measureIndex
    )
  };
};

export const expandedTracksSelector = createSelector(
  [tracksWithMeasuresSelector, playingIndexSelector, currentTrackIndexSelector],
  (tracks, playingIndex, currentTrackIndex) => {
    const expandedTracks = expandedTracksFromMeasures(tracks);

    return {
      playingIndex: getExpandedPlayingIndex(
        expandedTracks[currentTrackIndex].measures,
        playingIndex
      ),
      currentTrackIndex,
      expandedTracks
    };
  }
);
