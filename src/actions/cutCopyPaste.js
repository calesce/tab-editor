import * as types from './types';

export function copyNote(selection) {
  return {
    type: types.COPY_NOTE,
    selection
  };
}

export function cutNote(index, selection, range) {
  return {
    type: types.CUT_NOTE,
    index,
    selection,
    range
  };
}

export function pasteNote(index, clipboard) {
  return {
    type: types.PASTE_NOTE,
    index,
    clipboard
  };
}
