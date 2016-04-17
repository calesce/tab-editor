import * as types from './types';

export function setCursor(index) {
  return {
    type: types.SET_CURSOR,
    index
  };
}

export function moveCursorLeft() {
  return {
    type: types.MOVE_CURSOR_LEFT
  };
}

export function moveCursorRight() {
  return {
    type: types.MOVE_CURSOR_RIGHT
  };
}

export function moveCursorUp() {
  return {
    type: types.MOVE_CURSOR_UP
  };
}

export function moveCursorDown() {
  return {
    type: types.MOVE_CURSOR_DOWN
  };
}

export function setSelectRange(range) {
  return {
    type: types.SET_SELECT_RANGE,
    range
  };
}
