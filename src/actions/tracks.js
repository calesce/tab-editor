export const INSERT_TRACK = 'INSERT_TRACK';
export const DELETE_TRACK = 'DELETE_TRACK';
export const SELECT_TRACK = 'SELECT_TRACK';
export const RESIZE = 'RESIZE';
export const CHANGE_LAYOUT = 'CHANGE_LAYOUT';
export const REPLACE_SONG = 'REPLACE_SONG';

export function insertTrack() {
  return {
    type: INSERT_TRACK
  };
}

export function deleteTrack(index) {
  return {
    type: DELETE_TRACK,
    index
  };
}

export function selectTrack(index) {
  return {
    type: SELECT_TRACK,
    index
  };
}

export function resize() {
  return {
    type: RESIZE
  };
}

export function changeLayout(layout) {
  return {
    type: CHANGE_LAYOUT,
    layout
  };
}

export function replaceSong(tracks) {
  return {
    type: REPLACE_SONG,
    tracks
  };
}
