import tracks from './tracks';

export default function rootReducer(state = {}, action) {
  return {
    tracks: tracks(state, action),
    currentTrackIndex: state.currentTrackIndex
  };
}
