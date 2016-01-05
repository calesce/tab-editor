import * as types from './types';

export function advancePlayingNote(index) {
  return {
    type: types.ADVANCE_PLAYING_NOTE,
    index
  };
}

export function setPlayingNote(index) {
  return {
    type: types.SET_PLAYING_NOTE,
    index
  };
}
