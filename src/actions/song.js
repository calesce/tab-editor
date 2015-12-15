import * as types from './types';

export function changeNote(index, fret) {
  return {
    type: types.CHANGE_NOTE,
    index,
    fret
  };
}

export function deleteNote(index) {
  return {
    type: types.DELETE_NOTE,
    index
  };
}

export function deleteMeasure(measureIndex) {
  return {
    type: types.DELETE_MEASURE,
    measureIndex
  };
}

export function insertMeasure(index) {
  return {
    type: types.INSERT_MEASURE,
    index
  };
}

export function changeNoteLength(index, duration) {
  return {
    type: types.CHANGE_NOTE_LENGTH,
    index,
    duration
  };
}

export function insertNote(index) {
  return {
    type: types.INSERT_NOTE,
    index
  };
}

export function changeTimeSignature(measureIndex, timeSignature) {
  return {
    type: types.CHANGE_TIME_SIGNATURE,
    measureIndex,
    timeSignature
  };
}
