/* @flow */

export const CUT_NOTE = 'CUT_NOTE';
export const COPY_NOTE = 'COPY_NOTE';
export const PASTE_NOTE = 'PASTE_NOTE';

import type { PlayingIndex } from '../util/stateTypes';

export function copyNote(selection: any): Object {
  return {
    type: COPY_NOTE,
    selection
  };
}

export function cutNote(index: PlayingIndex, selection: any, range: any): Object {
  return {
    type: CUT_NOTE,
    index,
    selection,
    range
  };
}

export function pasteNote(index: PlayingIndex, clipboard: any): Object {
  return {
    type: PASTE_NOTE,
    index,
    clipboard
  };
}
