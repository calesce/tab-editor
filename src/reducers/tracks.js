import track from './track';
import layout from './layout';
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
        clipboard: action.note
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
        layout: layout(state.layout, action)
      };
    }
  }
}
