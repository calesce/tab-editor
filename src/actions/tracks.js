/* @flow */

export const INSERT_TRACK = 'INSERT_TRACK';
export const DELETE_TRACK = 'DELETE_TRACK';
export const SELECT_TRACK = 'SELECT_TRACK';
export const CHANGE_LAYOUT = 'CHANGE_LAYOUT';
export const REPLACE_SONG = 'REPLACE_SONG';

import type { PlayingIndex, Layout, Track } from '../util/stateTypes';
import type { Action } from './types';

export function insertTrack(): Action {
  return { type: INSERT_TRACK };
}

export function deleteTrack(index: PlayingIndex): Action {
  return { type: DELETE_TRACK, index };
}

export function selectTrack(index: PlayingIndex): Action {
  return { type: SELECT_TRACK, index };
}

export function changeLayout(layout: Layout): Action {
  return { type: CHANGE_LAYOUT, layout };
}

export function replaceSong(tracks: Array<Track>): Action {
  return { type: REPLACE_SONG, tracks };
}
