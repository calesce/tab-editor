import { createSelector } from 'reselect';
import { memoize } from 'lodash';
import { calcMeasureValidity } from './audioMath';

const memoizedValidity = memoize(calcMeasureValidity);

export function timeSignatureSelector(state) {
  const measures = state.tracks.present[state.currentTrackIndex].measures;
  const measureIndex = state.cursor.measureIndex;
  return measures.length > 0 ? measures[measureIndex].timeSignature : { beats: 4, beatType: 4 };
}

const currentMeasureSelector = state => state.tracks.present[state.currentTrackIndex].measures;
const measureIndexSelector = (_, props) => props.measureIndex;
const scoreBoxSelector = state => state.scoreBox;

const measureSelector = createSelector(
  currentMeasureSelector, measureIndexSelector,
  (measures, propsMeasureIndex) => {
  let measureIndex;
  if(measures.length - 1 < propsMeasureIndex) {
    measureIndex = measures.length - 1;
  } else {
    measureIndex = propsMeasureIndex;
  }
  return {
    measure: measures[measureIndex],
    measureIndex
  };
});

export const playingIndexSelector = state => state.playingIndex;
const cursorSelector = state => state.cursor;
const tuningSelector = state => state.tracks.present[state.currentTrackIndex].tuning;
const measureLengthSelector = state => state.tracks.present[state.currentTrackIndex].measures.length;
export const selectRangeSelector = state => state.selectRange;

export const finalMeasureSelector = createSelector(
  measureSelector,
  playingIndexSelector,
  tuningSelector,
  measureLengthSelector,
  selectRangeSelector,
  ({ measure, measureIndex }, playingIndex, tuning, measureLength, selectRange) => {
    let playingNoteIndex;
    if(playingIndex) {
      playingNoteIndex = playingIndex.measureIndex === measureIndex ? playingIndex.noteIndex : undefined;
    }

    return {
      measure,
      playingNoteIndex,
      isValid: memoizedValidity(measure),
      tuning,
      measureLength,
      selectRange: selectRange ? selectRange[measureIndex] : undefined
    };
  }
);

export const cursorSelectorForMeasure = createSelector(
  measureSelector,
  cursorSelector,
  playingIndexSelector,
  selectRangeSelector,
  ({ measureIndex }, cursor, playingIndex, selectRange) => {
    return (!playingIndex && cursor.measureIndex === measureIndex && !selectRange) ? { cursor }: { cursor: undefined };
});

const measuresTuningLayoutSelector = state => {
  return {
    measures: state.tracks.present[state.currentTrackIndex].measures,
    tuning: state.tracks.present[state.currentTrackIndex].tuning,
    layout: state.layout
  };
};

const calcHeight = (measures, tuning) => {
  return (measures[measures.length - 1].rowIndex + 1) * (210 + 20 * tuning.length);
};

const calcWidth = (measures) => {
  return measures.reduce((width, measure) => {
    return measure.width + width;
  }, 20);
};

export const scoreSelector = createSelector(
  measuresTuningLayoutSelector,
  scoreBoxSelector,
  ({ measures, tuning, layout }, { x, y, width }) => {
    return {
      measures,
      rowHeight: 20 * tuning.length + 210,
      height: layout === 'linear' ? '99%' : calcHeight(measures, tuning),
      width: layout === 'linear' ? calcWidth(measures) : width,
      x, y
    };
  }
);

const instrumentListSelector = state => state.tracks.present.map(track => track.instrument);

export const makeAppSelector = () => {
  return createSelector(
    state => ({
      measures: state.tracks.present[state.currentTrackIndex].measures,
      clipboard: state.clipboard,
      layout: state.layout,
      playingIndex: state.playingIndex,
      cursor: state.cursor,
      selectRange: state.selectRange,
      tuning: state.tracks.present[state.currentTrackIndex].tuning,
      currentTrackIndex: state.currentTrackIndex,
      metronome: state.metronome,
      countdown: state.countdown,
      future: state.future,
      past: state.past
    }),
    instrumentListSelector,
    (appState, instruments) => {
      return {
        ...appState,
        instruments
      };
    }
  );
};
