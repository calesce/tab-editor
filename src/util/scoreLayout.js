/* @flow */
import shallowEqual from '../util/shallowEqual';
import { isEqual, flatten, last } from 'lodash';
import {
  getHighestNote,
  getLowestNote,
  getMidiFromNote,
  midiDiff
} from './midiNotes';

import type { Tuning } from './stateTypes';

export function getScoreSectionWidth() {
  return window.innerWidth - 270;
}

export const calcScoreHeight = (measures: [Object], tuning: Tuning) => {
  const rows = measures.reduce((rows, measure) => {
    return measure.indexOfRow === 0 ? rows.concat(measure) : rows;
  }, []);

  return rows.reduce((sum, measure) => {
    return sum + 20 * tuning.length + (measure.yTop + measure.yBottom + 75);
  }, 0);
};

const calcXForNote = (
  measure: Object,
  noteIndex: number,
  indexOfRow: ?number
): number => {
  let x = 0 + (noteIndex * 53 + 33);
  if (indexOfRow === 0) {
    x += 10;
  }
  if (measure.renderTimeSignature) {
    x += 30;
  }
  if (measure.notes.length === 0 && measure.indexOfRow !== 0) {
    x -= measure.renderTimeSignature ? 0 : 25;
  }
  if (measure.repeatBegin) {
    x += 15;
  }
  return x;
};

const computeTrackLayout = (measures: Array<Object>): Array<Object> => {
  return measures.map((measure, measureIndex) => {
    let width = 59 * measure.notes.length;
    let renderTempo = false;
    if (measure.notes.length === 0) {
      width = 40;
    } else if (measure.notes.length === 1) {
      width = 80;
    }
    if (measureIndex === 0) {
      width += 15;
      renderTempo = true;
    }
    if (measure.repeatEnd) {
      width += 15;
    }
    if (measure.repeatBegin) {
      width += 15;
    }

    let prevMeasure = measures[measureIndex - 1];
    if (
      prevMeasure &&
      shallowEqual(prevMeasure.timeSignature, measure.timeSignature)
    ) {
      if (prevMeasure.tempo !== measure.tempo) {
        renderTempo = true;
      }

      const newMeasure = {
        ...measure,
        width,
        renderTimeSignature: false,
        renderTempo
      };
      return isEqual(newMeasure, measure) ? measure : newMeasure;
    }
    width += 30;
    if (measure.notes.length === 0) {
      width += 20;
    }

    const newMeasure = {
      ...measure,
      width,
      renderTimeSignature: true,
      renderTempo
    };
    return isEqual(newMeasure, measure) ? measure : newMeasure;
  });
};

const trackWithRows = (measures: Array<Object>): Array<Object> => {
  return measures.reduce((newMeasures, measure, measureIndex) => {
    if (measureIndex === 0) {
      const notes = measure.notes.map((note, noteIndex) => ({
        ...note,
        x: calcXForNote(measure, noteIndex, 0)
      }));

      const newMeasure = {
        ...measure,
        notes,
        rowIndex: measureIndex,
        indexOfRow: 0,
        xOfMeasure: 0
      };
      return [isEqual(newMeasure, measure) ? measure : newMeasure];
    }

    const currentRow = newMeasures[measureIndex - 1].rowIndex;
    const currentRowWidth = newMeasures
      .slice(0, measureIndex)
      .reduce((accum, next) => {
        if (next.rowIndex === currentRow) {
          return accum + next.width;
        }
        return accum;
      }, 0);

    let newRowIndex = currentRow;
    let indexOfRow;
    if (currentRowWidth + measure.width >= getScoreSectionWidth()) {
      newRowIndex = currentRow + 1;
      indexOfRow = 0;
    }

    const notes = measure.notes.map((note, noteIndex) => ({
      ...note,
      x: calcXForNote(measure, noteIndex, indexOfRow)
    }));

    const newMeasure = {
      ...measure,
      notes,
      rowIndex: newRowIndex,
      indexOfRow,
      xOfMeasure: indexOfRow === 0 ? indexOfRow : currentRowWidth
    };
    return newMeasures.concat(
      isEqual(newMeasure, measure) ? measure : newMeasure
    );
  }, []);
};

const linearTrack = (track: Array<Object>): Array<Object> => {
  return track.map((measure, i) => {
    const indexOfRow = i === 0 ? 0 : undefined;
    const newMeasure = {
      ...measure,
      notes: measure.notes.map((note, noteIndex) => ({
        ...note,
        x: calcXForNote(measure, noteIndex, indexOfRow)
      })),
      rowIndex: 0,
      indexOfRow
    };
    return isEqual(newMeasure, measure) ? measure : newMeasure;
  });
};

const midiNotesForMeasure = (
  measure: Object,
  tuning: Tuning
): Array<string> => {
  return flatten(
    measure.notes.map(note => {
      return note.fret.map((fret, i) =>
        getMidiFromNote(fret, note.string[i], tuning)
      );
    })
  );
};

const getYTop = (midi: string): number => (midi ? midiDiff(midi, 'g4') : 0);
const getYBottom = (midi: string): number => (midi ? midiDiff('f3', midi) : 0);

const getRowHeights = (
  measures: Array<Object>,
  tuning: Tuning
): Array<Object> => {
  const rows = measures.reduce((rowGroups, measure) => {
    const midiNotes = midiNotesForMeasure(measure, tuning);
    const highest = getHighestNote(midiNotes);
    const lowest = getLowestNote(midiNotes);

    if (measure.indexOfRow === 0) {
      // new row
      return rowGroups.concat({ highest, lowest });
    } else {
      if (midiNotes.length === 0) {
        return rowGroups;
      }
      return rowGroups.slice(0, rowGroups.length - 1).concat({
        highest: getHighestNote([last(rowGroups).highest, highest]),
        lowest: getLowestNote([last(rowGroups).lowest, lowest])
      });
    }
  }, []);

  const rowsWithY = rows.map(row => {
    const yTop = getYTop(row.highest) * 6.5;
    // 6.5 is about half of the distance between bars on the staff
    const yBottom = getYBottom(row.lowest) * 6.5;
    return { yTop: yTop > 0 ? yTop : 0, yBottom: yBottom > 0 ? yBottom : 0 };
  });

  return measures.map((measure, i) => {
    return {
      ...measure,
      measureIndex: i,
      yTop: rowsWithY[measure.rowIndex].yTop,
      yBottom: rowsWithY[measure.rowIndex].yBottom
    };
  });
};

export const prepareRowLayout = (
  measures: Array<Object>,
  layout: string,
  tuning: Tuning
): Array<Object> => {
  const newMeasures =
    layout === 'page'
      ? trackWithRows(computeTrackLayout(measures))
      : linearTrack(computeTrackLayout(measures));

  return getRowHeights(newMeasures, tuning);
};
