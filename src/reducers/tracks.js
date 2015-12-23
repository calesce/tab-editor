import track from './track';

export default function tracks(state = {}, action) {
  if(state === {}) {
    return {};
  }

  const newState = [ track(state.tracks[state.currentTrackIndex], action) ];

  return newState;
}
