/* @flow */
import shallowEqual from '../util/shallowEqual';
import { isEqual } from 'lodash';

type ScoreBox = { x: number; y: number, width: number };

const calcXForNote = (measure: Object, noteIndex: number, indexOfRow: ?number): number => {
  let x = 0 + (noteIndex * 53 + 33);
  if(indexOfRow === 0) {
    x += 10;
  }
  if(measure.renderTimeSignature) {
    x += 30;
  }
  if(measure.notes.length === 0 && measure.indexOfRow !== 0) {
    x -= measure.renderTimeSignature ? 0 : 25;
  }
  return x;
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

const computeTrackLayout = (measures: Array<Object>): Array<Object> => {
  return measures.map((measure, measureIndex) => {
    let width = 59 * measure.notes.length;
    let showBpm = false;
    if(measure.notes.length === 0) {
      width = 40;
    }
    if(measureIndex === 0) {
      width += 15;
      showBpm = true;
    }

    let prevMeasure = measures[measureIndex - 1];
    if(prevMeasure && shallowEqual(prevMeasure.timeSignature, measure.timeSignature)) {
      if(prevMeasure.bpm !== measure.bpm) {
        showBpm = true;
      }

      const newMeasure = {
        ...measure,
        width,
        renderTimeSignature: false,
        showBpm
      };
      return isEqual(newMeasure, measure) ? measure : newMeasure;
    }
    width += 30;
    if(measure.notes.length === 0) {
      width += 20;
    }

    const newMeasure = {
      ...measure,
      width,
      renderTimeSignature: true,
      showBpm
    };
    return isEqual(newMeasure, measure) ? measure : newMeasure;
  });
};

const trackWithRows = (measures: Array<Object>, scoreBox: ScoreBox): Array<Object> => {
  return measures.reduce((newMeasures, measure, measureIndex) => {
    if(measureIndex === 0) {
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
    const currentRowWidth = newMeasures.slice(0, measureIndex).reduce((accum, next) => {
      if(next.rowIndex === currentRow) {
        return accum + next.width;
      }
      return accum;
    }, 0);

    let newRowIndex = currentRow;
    let indexOfRow;
    if(currentRowWidth + measure.width >= scoreBox.width) {
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
    return newMeasures.concat(isEqual(newMeasure, measure) ? measure : newMeasure);
  }, []);
};

export const prepareRowLayout = (measures: Array<Object>, layout: string, scoreBox: ScoreBox): Array<Object> => {
  return layout === 'page' ?
    trackWithRows(computeTrackLayout(measures), scoreBox) :
    linearTrack(computeTrackLayout(measures));
};
