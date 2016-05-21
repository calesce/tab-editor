import { createSelector } from 'reselect';
import { memoize } from 'lodash';
import { calcMeasureValidity } from './audioMath';

const memoizedValidity = memoize(calcMeasureValidity);

export function timeSignatureSelector(state) {
  const measures = state.present.tracks[state.present.currentTrackIndex].measures;
  const measureIndex = state.present.cursor.measureIndex;
  return measures.length > 0 ? measures[measureIndex].timeSignature : { beats: 4, beatType: 4 };
}

const currentMeasureSelector = state => state.present.tracks[state.present.currentTrackIndex].measures;
const measureIndexSelector = (_, props) => props.measureIndex;

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

export const playingIndexSelector = state => state.present.playingIndex;
const cursorSelector = state => state.present.cursor;
const tuningSelector = state => state.present.tracks[state.present.currentTrackIndex].tuning;
const measureLengthSelector = state => state.present.tracks[state.present.currentTrackIndex].measures.length;
export const selectRangeSelector = state => state.present.selectRange;

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

const measuresTuningLayoutSelector = state => (
  {
    measures: state.present.tracks[state.present.currentTrackIndex].measures,
    tuning: state.present.tracks[state.present.currentTrackIndex].tuning,
    layout: state.present.layout
  }
);

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
  ({ measures, tuning, layout }) => {
    return {
      measures,
      rowHeight: 20 * tuning.length + 210,
      height: layout === 'linear' ? '99%' : calcHeight(measures, tuning),
      width: layout === 'linear' ? calcWidth(measures) : window.innerWidth - 10
    };
  }
);

const instrumentListSelector = state => {
  return state.present.tracks.map(track => track.instrument);
};

export const makeAppSelector = () => {
  return createSelector(
    state => ({
      measures: state.present.tracks[state.present.currentTrackIndex].measures,
      clipboard: state.present.clipboard,
      layout: state.present.layout,
      playingIndex: state.present.playingIndex,
      cursor: state.present.cursor,
      selectRange: state.present.selectRange,
      tuning: state.present.tracks[state.present.currentTrackIndex].tuning,
      currentTrackIndex: state.present.currentTrackIndex,
      metronome: state.present.metronome,
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
