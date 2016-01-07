import track from './track';
import layout from './layout';
import playingNote from './playingNote';
import cursor from './cursor';
import { prepareRows } from '../util';
import { COPY_NOTE, CUT_NOTE, CHANGE_LAYOUT } from '../actions/types';

const replaceTrack = (tracks, action, currentTrackIndex, layout = 'page') => {
  return tracks.map((t, index) => {
    if(index === currentTrackIndex) {
      const newTrack = track(t, action);
      return {
        ...newTrack,
        measures: prepareRows(newTrack.measures, layout)
      };
    }
    return t;
  });
};

export default function tracks(state = {}, action) {
  switch(action.type) {
    case COPY_NOTE:
      return {
        ...state,
        clipboard: action.note
      };

    case CUT_NOTE:
      return {
        ...state,
        tracks: replaceTrack(state.tracks, action, state.currentTrackIndex, state.layout),
        clipboard: action.note,
        cursor: cursor(state.cursor, state.tracks[state.currentTrackIndex].measures, action)
      };

    case CHANGE_LAYOUT:
      const newLayout = layout(state.layout, action);
      return {
        ...state,
        tracks: replaceTrack(state.tracks, action, state.currentTrackIndex, newLayout),
        layout: newLayout
      };

    default: {
      return {
        tracks: replaceTrack(state.tracks, action, state.currentTrackIndex, state.layout),
        currentTrackIndex: state.currentTrackIndex,
        clipboard: state.clipboard,
        layout: layout(state.layout, action),
        playingNote: playingNote(state.playingNote, action),
        cursor: cursor(state.cursor, state.tracks[state.currentTrackIndex].measures, action)
      };
    }
  }
}
