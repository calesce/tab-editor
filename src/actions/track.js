import * as types from './types';

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

export function replaceSong(song) {
  return {
    type: types.REPLACE_SONG,
    song
  };
}

export function changeTuning(tuning) {
  return {
    type: types.CHANGE_TUNING,
    tuning
  };
}

export function copyNote(note) {
  return {
    type: types.COPY_NOTE,
    note
  };
}

export function cutNote(index, note) {
  return {
    type: types.CUT_NOTE,
    index,
    note
  };
}

export function resize() {
  return {
    type: types.RESIZE
  };
}
