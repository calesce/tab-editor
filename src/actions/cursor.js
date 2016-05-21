export const SET_CURSOR = 'SET_CURSOR';
export const MOVE_CURSOR_LEFT = 'MOVE_CURSOR_LEFT';
export const MOVE_CURSOR_RIGHT = 'MOVE_CURSOR_RIGHT';
export const MOVE_CURSOR_UP= 'MOVE_CURSOR_UP';
export const MOVE_CURSOR_DOWN = 'MOVE_CURSOR_DOWN';
export const SET_SELECT_RANGE = 'SET_SELECT_RANGE';

export function setCursor(index) {
  return {
    type: SET_CURSOR,
    index
  };
}

export function moveCursorLeft() {
  return {
    type: MOVE_CURSOR_LEFT
  };
}

export function moveCursorRight() {
  return {
    type: MOVE_CURSOR_RIGHT
  };
}

export function moveCursorUp() {
  return {
    type: MOVE_CURSOR_UP
  };
}

export function moveCursorDown() {
  return {
    type: MOVE_CURSOR_DOWN
  };
}

export function setSelectRange(range) {
  return {
    type: SET_SELECT_RANGE,
    range
  };
}
