import track from './track';

const replaceTrack = (tracks, action, currentTrackIndex) => {
  return tracks.map((t, index) => {
    if(index === currentTrackIndex) {
      return track(t, action);
    }
    return t;
  });
};

export default function tracks(state = {}, action) {
  return {
    tracks: replaceTrack(state.tracks, action, state.currentTrackIndex),
    currentTrackIndex: state.currentTrackIndex
  };
}
