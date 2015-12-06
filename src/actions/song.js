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
