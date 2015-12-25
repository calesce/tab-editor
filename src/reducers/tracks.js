import track from './track';
import { COPY_NOTE, CUT_NOTE } from '../actions/types';

const replaceTrack = (tracks, action, currentTrackIndex) => {
  return tracks.map((t, index) => {
    if(index === currentTrackIndex) {
      return track(t, action);
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
        tracks: replaceTrack(state.tracks, action, state.currentTrackIndex),
        clipboard: action.note
      };

    default: {
      return {
        tracks: replaceTrack(state.tracks, action, state.currentTrackIndex),
        currentTrackIndex: state.currentTrackIndex,
        clipboard: state.clipboard
      };
    }
  }
}
