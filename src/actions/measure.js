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

export function changeTimeSignature(index, timeSignature, all) {
  return {
    type: types.CHANGE_TIME_SIGNATURE,
    index,
    timeSignature,
    all
  };
}

export function toggleNoteDotted(index) {
  return {
    type: types.TOGGLE_NOTE_DOTTED,
    index
  };
}

export function toggleNoteTremolo(index) {
  return {
    type: types.TOGGLE_NOTE_TREMOLO,
    index
  };
}

export function toggleNoteTrill(index) {
  return {
    type: types.TOGGLE_NOTE_TRILL,
    index
  };
}

export function toggleNoteVibrato(index) {
  return {
    type: types.TOGGLE_NOTE_VIBRATO,
    index
  };
}

export function pasteNote(index, clipboard) {
  return {
    type: types.PASTE_NOTE,
    index,
    clipboard
  };
}

export function changeBpm(index, bpm, all) {
  return {
    type: types.CHANGE_BPM,
    index,
    bpm,
    all
  };
}

export function increaseNoteLength(index) {
  return {
    type: types.INCREASE_NOTE_LENGTH,
    index
  };
}

export function decreaseNoteLength(index) {
  return {
    type: types.DECREASE_NOTE_LENGTH,
    index
  };
}

export function addRepeatEnd(index) {
  return {
    type: types.ADD_REPEAT_END,
    index
  };
}
