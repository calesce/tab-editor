import track from './track';

export default function tracks(state = {}, action) {
  if(state === {}) {
    return {};
  }

  const newState = [ {
    measures: track(state.tracks[state.currentTrackIndex], action),
    tuning: state.tracks[state.currentTrackIndex].tuning
  }];

  return newState;
}
