/* @flow */

export const SET_CURSOR = 'SET_CURSOR';
export const MOVE_CURSOR_LEFT = 'MOVE_CURSOR_LEFT';
export const MOVE_CURSOR_RIGHT = 'MOVE_CURSOR_RIGHT';
export const MOVE_CURSOR_UP = 'MOVE_CURSOR_UP';
export const MOVE_CURSOR_DOWN = 'MOVE_CURSOR_DOWN';
export const SET_SELECT_RANGE = 'SET_SELECT_RANGE';

import type { Cursor, SelectRange } from '../util/stateTypes';
import type { Action } from './types';

export function setCursor(index: Cursor): Action {
  return { type: SET_CURSOR, index };
}

export function moveCursorLeft(): Action {
  return { type: MOVE_CURSOR_LEFT };
}

export function moveCursorRight(): Action {
  return { type: MOVE_CURSOR_RIGHT };
}

export function moveCursorUp(): Action {
  return { type: MOVE_CURSOR_UP };
}

export function moveCursorDown(): Action {
  return { type: MOVE_CURSOR_DOWN };
}

export function setSelectRange(range: SelectRange): Action {
  return { type: SET_SELECT_RANGE, range };
}
