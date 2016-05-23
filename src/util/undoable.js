import undoable, { excludeAction } from 'redux-undo';

import * as types from '../actions/cursor';
import { RESIZE } from '../actions/tracks';
import { SET_PLAYING_INDEX } from '../actions/playingIndex';

export const getUndoableReducer = (reducer) => {
  const ignoredTypes = [SET_PLAYING_INDEX, types.SET_CURSOR, types.SET_SELECT_RANGE, RESIZE,
   types.MOVE_CURSOR_UP, types.MOVE_CURSOR_DOWN, types.MOVE_CURSOR_LEFT, types.MOVE_CURSOR_RIGHT ];
  return undoable(reducer, { filter: excludeAction(ignoredTypes) });
};
