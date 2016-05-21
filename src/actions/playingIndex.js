import * as types from './types';

export function setPlayingIndex(index) {
  return {
    type: types.SET_PLAYING_INDEX,
    index
  };
}

export function toggleMetronome() {
  return {
    type: types.TOGGLE_METRONOME
  };
}
