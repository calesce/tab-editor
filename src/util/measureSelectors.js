import { createSelector } from 'reselect';
import { trackWithLayoutSelector } from './layoutSelectors';
import { cursorSelector, playingIndexSelector, selectRangeSelector,
  tuningSelector, measureLengthSelector } from './selectors';
import { memoizedValidity } from './audioMath';
import { getAccidentals } from './accidentals';

const measureIndexSelector = (_, props) => props.measureIndex;

const currentMeasureSelector = createSelector(
  [measureIndexSelector, trackWithLayoutSelector],
  (measureIndex, measures) => measures[measureIndex] || measures[measures.length - 1] // FIXME workaround to score selector not updating
);

const playingNoteIndexSelector = createSelector([playingIndexSelector, measureIndexSelector],
  (playingIndex, measureIndex) => {
    if(playingIndex) {
      return playingIndex.measureIndex === measureIndex ? playingIndex.noteIndex : undefined;
    }
    return undefined;
  }
);

export const makeMeasureSelector = () => {
  return createSelector(
    [
      currentMeasureSelector, measureIndexSelector, playingNoteIndexSelector, tuningSelector,
      measureLengthSelector, selectRangeSelector
    ],
    (measure, measureIndex, playingNoteIndex, tuning, measureLength, selectRange) => {
      return {
        measure: {
          ...measure,
          notes: getAccidentals(measure.notes, measure.yTop, playingNoteIndex, tuning)
        },
        playingNoteIndex,
        isValid: memoizedValidity(measure),
        tuning,
        measureLength,
        yTop: measure.yTop,
        notesWithAccidentals: getAccidentals(measure.notes, measure.yTop, playingNoteIndex, tuning),
        rowHeight: measure.yTop + measure.yBottom + 75,
        selectRange
      };
    }
  );
};

export const makeTabMeasureSelector = () => {
  return createSelector(
    [ measureIndexSelector, cursorSelector, playingIndexSelector, selectRangeSelector ],
    (measureIndex, cursor, playingIndex, selectRange) => {
      return (!playingIndex && cursor.measureIndex === measureIndex && !selectRange) ? { cursor }: { cursor: undefined };
  });
};
