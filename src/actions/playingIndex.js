import * as types from './types';

export function advancePlayingIndex(index) {
  return {
    type: types.ADVANCE_PLAYING_INDEX,
    index
  };
}

export function setPlayingIndex(index) {
  return {
    type: types.SET_PLAYING_INDEX,
    index
  };
}
