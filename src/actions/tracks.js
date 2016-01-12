import * as types from './types';

export function insertTrack() {
  return {
    type: types.INSERT_TRACK
  };
}

export function deleteTrack(index) {
  return {
    type: types.DELETE_TRACK,
    index
  };
}

export function selectTrack(index) {
  return {
    type: types.SELECT_TRACK,
    index
  };
}

export function resize() {
  return {
    type: types.RESIZE
  };
}

export function changeLayout(layout) {
  return {
    type: types.CHANGE_LAYOUT,
    layout
  };
}
