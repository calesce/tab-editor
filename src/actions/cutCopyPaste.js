/* @flow */

export const CUT_NOTE = 'CUT_NOTE';
export const COPY_NOTE = 'COPY_NOTE';
export const PASTE_NOTE = 'PASTE_NOTE';

import type { PlayingIndex, Clipboard, Range } from '../util/stateTypes';
import type { Action } from './types';

export function copyNote(selection: Clipboard): Action {
  return { type: COPY_NOTE, selection };
}

export function cutNote(
  index: PlayingIndex,
  selection: Clipboard,
  range: ?Range
): Action {
  return { type: CUT_NOTE, index, selection, range };
}

export function pasteNote(index: PlayingIndex, clipboard: Clipboard): Action {
  return { type: PASTE_NOTE, index, clipboard };
}
