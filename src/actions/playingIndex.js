/* @flow */

export const SET_PLAYING_INDEX = 'SET_PLAYING_INDEX';
export const TOGGLE_METRONOME = 'TOGGLE_METRONOME';
export const TOGGLE_COUNTDOWN = 'TOGGLE_COUNTDOWN';

import type { PlayingIndex } from '../util/stateTypes';

export function setPlayingIndex(index: PlayingIndex) {
  return {
    type: SET_PLAYING_INDEX,
    index
  };
}

export function toggleMetronome() {
  return {
    type: TOGGLE_METRONOME
  };
}

export function toggleCountdown() {
  return {
    type: TOGGLE_COUNTDOWN
  };
}
