/* @flow */

export const CHANGE_NOTE = 'CHANGE_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const CHANGE_NOTE_LENGTH = 'CHANGE_NOTE_LENGTH';
export const INSERT_NOTE = 'INSERT_NOTE';
export const MAKE_NOTE_REST = 'MAKE_NOTE_REST';
export const TOGGLE_NOTE_DOTTED = 'TOGGLE_NOTE_DOTTED';
export const SET_NOTE_TUPLET = 'SET_NOTE_TUPLET';
export const TOGGLE_NOTE_TREMOLO = 'TOGGLE_NOTE_TREMOLO';
export const TOGGLE_NOTE_VIBRATO = 'TOGGLE_NOTE_VIBRATO';
export const TOGGLE_NOTE_TRILL = 'TOGGLE_NOTE_TRILL';
export const INCREASE_NOTE_LENGTH = 'INCREASE_NOTE_LENGTH';
export const DECREASE_NOTE_LENGTH = 'DECREASE_NOTE_LENGTH';
export const TOGGLE_REPEAT_END = 'TOGGLE_REPEAT_END';
export const TOGGLE_REPEAT_BEGIN = 'TOGGLE_REPEAT_BEGIN';

import type { PlayingIndex, Duration } from '../util/stateTypes';
import type { Action } from './types';

export function changeNote(index: PlayingIndex, fret: number): Action {
  return { type: CHANGE_NOTE, index, fret };
}

export function deleteNote(index: PlayingIndex): Action {
  return { type: DELETE_NOTE, index };
}

export function changeNoteLength(
  index: PlayingIndex,
  duration: Duration
): Action {
  return { type: CHANGE_NOTE_LENGTH, index, duration };
}

export function insertNote(index: PlayingIndex): Action {
  return { type: INSERT_NOTE, index };
}

export function makeNoteRest(index: PlayingIndex): Action {
  return { type: MAKE_NOTE_REST, index };
}

export function toggleNoteDotted(index: PlayingIndex): Action {
  return { type: TOGGLE_NOTE_DOTTED, index };
}

export function toggleNoteTremolo(index: PlayingIndex): Action {
  return { type: TOGGLE_NOTE_TREMOLO, index };
}

export function toggleNoteTrill(index: PlayingIndex): Action {
  return { type: TOGGLE_NOTE_TRILL, index };
}

export function toggleNoteVibrato(index: PlayingIndex): Action {
  return { type: TOGGLE_NOTE_VIBRATO, index };
}

export function setNoteTuplet(index: PlayingIndex, tuplet: ?string): Action {
  return { type: SET_NOTE_TUPLET, index, tuplet };
}

export function increaseNoteLength(index: PlayingIndex): Action {
  return { type: INCREASE_NOTE_LENGTH, index };
}

export function decreaseNoteLength(index: PlayingIndex): Action {
  return { type: DECREASE_NOTE_LENGTH, index };
}

export function toggleRepeatBegin(index: PlayingIndex): Action {
  return { type: TOGGLE_REPEAT_BEGIN, index };
}

export function toggleRepeatEnd(index: PlayingIndex): Action {
  return { type: TOGGLE_REPEAT_END, index };
}
