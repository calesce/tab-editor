import { createSelector } from 'reselect';
import { trackWithLayoutSelector } from './layout';
import {
  cursorSelector,
  playingIndexSelector,
  selectRangeSelector,
  tuningSelector,
  measureLengthSelector
} from './index';
import { memoizedValidity } from '../audioMath';
import { getAccidentals } from '../accidentals';

const measureIndexSelector = (_, props) => props.measureIndex;
const otherMeasureIndexSelector = (_, props) => props.measure.measureIndex;

const currentMeasureSelector = createSelector(
  [measureIndexSelector, trackWithLayoutSelector],
  // FIXME workaround to score selector not updating
  (measureIndex, measures) =>
    measures[measureIndex] || measures[measures.length - 1]
);

const playingNoteIndexSelector = createSelector(
  [playingIndexSelector, measureIndexSelector],
  (playingIndex, measureIndex) => {
    if (playingIndex) {
      return playingIndex.measureIndex === measureIndex
        ? playingIndex.noteIndex
        : undefined;
    }
    return undefined;
  }
);

export const makeMeasureSelector = () => {
  return createSelector(
    [
      currentMeasureSelector,
      measureIndexSelector,
      playingNoteIndexSelector,
      tuningSelector,
      measureLengthSelector,
      selectRangeSelector
    ],
    (
      measure,
      measureIndex,
      playingNoteIndex,
      tuning,
      measureLength,
      selectRange
    ) => {
      return {
        measure: {
          ...measure,
          notes: getAccidentals(
            measure.notes,
            measure.yTop,
            playingNoteIndex,
            tuning
          )
        },
        playingNoteIndex,
        isValid: memoizedValidity(measure),
        tuning,
        isLastMeasure: measureLength - 1 === measure.measureIndex,
        yTop: measure.yTop,
        notesWithAccidentals: getAccidentals(
          measure.notes,
          measure.yTop,
          playingNoteIndex,
          tuning
        ),
        rowHeight: measure.yTop + measure.yBottom + 75,
        selectRange
      };
    }
  );
};

export const makeTabMeasureSelector = () => {
  return createSelector(
    [
      otherMeasureIndexSelector,
      cursorSelector,
      playingIndexSelector,
      selectRangeSelector
    ],
    (measureIndex, cursor, playingIndex, selectRange) => {
      return !playingIndex &&
        cursor.measureIndex === measureIndex &&
        !selectRange
        ? { cursor }
        : { cursor: undefined };
    }
  );
};
