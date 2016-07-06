import { createSelector } from 'reselect';
import { trackWithLayoutSelector } from './layoutSelectors';
import { cursorSelector, playingIndexSelector, selectRangeSelector,
  tuningSelector, measureLengthSelector } from './selectors';
import { memoizedValidity } from './audioMath';

const measureIndexSelector = (_, props) => props.measureIndex;

const currentMeasureSelector = createSelector(
  [measureIndexSelector, trackWithLayoutSelector],
  (measureIndex, measures) => measures[measureIndex]
);

export const makeMeasureSelector = () => {
  return createSelector(
    [
      currentMeasureSelector, measureIndexSelector, playingIndexSelector, tuningSelector,
      measureLengthSelector, selectRangeSelector
    ],
    (measure, measureIndex, playingIndex, tuning, measureLength, selectRange) => {
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
};

export const makeTabMeasureSelector = () => {
  return createSelector(
    [ measureIndexSelector, cursorSelector, playingIndexSelector, selectRangeSelector ],
    (measureIndex, cursor, playingIndex, selectRange) => {
      return (!playingIndex && cursor.measureIndex === measureIndex && !selectRange) ? { cursor }: { cursor: undefined };
  });
};
