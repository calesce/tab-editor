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

export function changeTimeSignature(index, timeSignature) {
  return {
    type: types.CHANGE_TIME_SIGNATURE,
    index,
    timeSignature
  };
}

export function toggleNoteDotted(index) {
  return {
    type: types.TOGGLE_NOTE_DOTTED,
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

export function pasteNote(index, note) {
  return {
    type: types.PASTE_NOTE,
    index,
    note
  };
}
