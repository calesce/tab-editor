export const CHANGE_NOTE = 'CHANGE_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const INSERT_NOTE = 'INSERT_NOTE';
export const TOGGLE_NOTE_DOTTED = 'TOGGLE_NOTE_DOTTED';
export const SET_NOTE_TUPLET = 'SET_NOTE_TUPLET';
export const TOGGLE_NOTE_TREMOLO = 'TOGGLE_NOTE_TREMOLO';
export const TOGGLE_NOTE_VIBRATO = 'TOGGLE_NOTE_VIBRATO';
export const TOGGLE_NOTE_TRILL = 'TOGGLE_NOTE_TRILL';
export const CHANGE_NOTE_LENGTH = 'CHANGE_NOTE_LENGTH';
export const INCREASE_NOTE_LENGTH = 'INCREASE_NOTE_LENGTH';
export const DECREASE_NOTE_LENGTH = 'DECREASE_NOTE_LENGTH';
export const ADD_REPEAT_END = 'ADD_REPEAT_END';

export function changeNote(index, fret) {
  return {
    type: CHANGE_NOTE,
    index,
    fret
  };
}

export function deleteNote(index) {
  return {
    type: DELETE_NOTE,
    index
  };
}

export function changeNoteLength(index, duration) {
  return {
    type: CHANGE_NOTE_LENGTH,
    index,
    duration
  };
}

export function insertNote(index) {
  return {
    type: INSERT_NOTE,
    index
  };
}

export function toggleNoteDotted(index) {
  return {
    type: TOGGLE_NOTE_DOTTED,
    index
  };
}

export function toggleNoteTremolo(index) {
  return {
    type: TOGGLE_NOTE_TREMOLO,
    index
  };
}

export function toggleNoteTrill(index) {
  return {
    type: TOGGLE_NOTE_TRILL,
    index
  };
}

export function toggleNoteVibrato(index) {
  return {
    type: TOGGLE_NOTE_VIBRATO,
    index
  };
}

export function setNoteTuplet(index, tuplet) {
  return {
    type: SET_NOTE_TUPLET,
    index,
    tuplet
  };
}

export function increaseNoteLength(index) {
  return {
    type: INCREASE_NOTE_LENGTH,
    index
  };
}

export function decreaseNoteLength(index) {
  return {
    type: DECREASE_NOTE_LENGTH,
    index
  };
}

export function addRepeatEnd(index) {
  return {
    type: ADD_REPEAT_END,
    index
  };
}
