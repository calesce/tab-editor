import { createSelector } from 'reselect';
import { trackWithLayoutSelector } from './layout';

const instrumentListSelector = createSelector(
  state => state.tracks.present,
  tracks => tracks.map(track => track.instrument)
);

export const makeAppSelector = () => {
  return createSelector(
    state => ({
      scoreBox: state.scoreBox,
      clipboard: state.clipboard,
      layout: state.layout,
      playingIndex: state.playingIndex,
      cursor: state.cursor,
      selectRange: state.selectRange,
      tuning: state.tracks.present[state.currentTrackIndex].tuning,
      currentTrackIndex: state.currentTrackIndex,
      metronome: state.metronome,
      countdown: state.countdown,
      future: state.future,
      past: state.past
    }),
    instrumentListSelector,
    trackWithLayoutSelector,
    (appState, instruments, measures) => {
      return { ...appState, instruments, measures };
    }
  );
};
