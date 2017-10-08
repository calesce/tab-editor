/* @flow */

import type { Cursor, Measure, Clipboard } from './stateTypes';

export const getNextNote = (
  measures: Array<Measure>,
  { stringIndex, measureIndex, noteIndex }: Cursor
): Cursor => {
  if (noteIndex >= measures[measureIndex].notes.length - 1) {
    return { measureIndex: measureIndex + 1, noteIndex: 0, stringIndex };
  } else {
    return { measureIndex, noteIndex: noteIndex + 1, stringIndex };
  }
};

export const getPrevNote = (
  measures: Array<Measure>,
  { stringIndex, measureIndex, noteIndex }: Cursor
): Cursor => {
  if (measureIndex === 0 && noteIndex === 0) {
    return { measureIndex, noteIndex, stringIndex };
  } else if (noteIndex === 0) {
    let prevMeasure = measures[measureIndex - 1];
    if (prevMeasure.notes.length > 0) {
      return {
        measureIndex: measureIndex - 1,
        noteIndex: measures[measureIndex - 1].notes.length - 1,
        stringIndex
      };
    } else {
      return { measureIndex: measureIndex - 1, noteIndex: 0, stringIndex };
    }
  } else {
    return { measureIndex, noteIndex: noteIndex - 1, stringIndex };
  }
};

export const getUpperString = (
  stringIndex: number,
  stringCount: number
): number => {
  return stringIndex === stringCount - 1 ? 0 : stringIndex + 1;
};

export const getLowerString = (
  stringIndex: number,
  stringCount: number
): number => {
  return stringIndex === 0 ? stringCount - 1 : stringIndex - 1;
};

export const cursorAfterCutting = (
  measures: Array<Measure>,
  selectRange: any,
  oldCursor: Cursor
): Cursor => {
  const firstMeasureIndex = parseInt(Object.keys(selectRange)[0]);

  let measureIndex = firstMeasureIndex;
  let noteIndex;
  if (selectRange[firstMeasureIndex] === 'all') {
    const lastMeasure = Object.keys(selectRange)[
      Object.keys(selectRange).length - 1
    ];
    if (parseInt(lastMeasure) === measures.length - 1) {
      measureIndex = firstMeasureIndex === 0 ? 0 : firstMeasureIndex - 1;
    }
    if (Object.keys(selectRange).length === 1) {
      noteIndex = 0;
    }
  }

  if (noteIndex === undefined) {
    noteIndex =
      Object.keys(selectRange).length > 1 ? 0 : selectRange[measureIndex][0];
  }

  return {
    ...oldCursor,
    noteIndex: noteIndex === 0 ? 0 : noteIndex - 1,
    measureIndex
  };
};

export const cursorAfterPasting = (
  measures: Array<Measure>,
  clipboard: Clipboard,
  oldCursor: Cursor
): Cursor => {
  if (Array.isArray(clipboard.notes)) {
    return {
      ...oldCursor,
      noteIndex: oldCursor.noteIndex + clipboard.notes.length
    };
  } else if (!Array.isArray(clipboard)) {
    if (
      oldCursor.noteIndex ===
      measures[oldCursor.measureIndex].notes.length - 1
    ) {
      return { ...oldCursor, noteIndex: oldCursor.noteIndex + 1 };
    } else {
      return getNextNote(measures, oldCursor);
    }
  } else {
    return {
      ...oldCursor,
      measureIndex: oldCursor.measureIndex + clipboard.length,
      noteIndex: 0
    };
  }
};

export const getNotesFromSelection = (
  measures: Array<Measure>,
  { measureIndex, noteIndex }: Cursor,
  selectRange: Object
): Array<Object> | Object => {
  if (selectRange) {
    if (
      Object.keys(selectRange).length === 1 &&
      selectRange[Object.keys(selectRange)[0]] !== 'all'
    ) {
      const measureIndex = Object.keys(selectRange)[0];
      const measure = measures[parseInt(measureIndex)];
      const notes = measure.notes.filter((_, i) => {
        if (selectRange[measureIndex].indexOf(i) !== -1) {
          return true;
        }
        return false;
      });
      return { notes };
    }

    return measures.reduce((accum, measure, i) => {
      if (Array.isArray(selectRange[i])) {
        const range = selectRange[i];
        const notes = measure.notes.filter((_, j) => {
          return range.indexOf(j) !== -1;
        });
        accum.push({ ...measure, notes });
        return accum;
      } else if (selectRange[i] === 'all') {
        accum.push(measure);
        return accum;
      }
      return accum;
    }, []);
  } else {
    return measures[measureIndex].notes[noteIndex];
  }
};
