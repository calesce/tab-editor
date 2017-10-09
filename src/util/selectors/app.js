/* @flow */
import { createSelector } from 'reselect';
import { trackWithLayoutSelector } from './layout';
import type { State, Track } from '../stateTypes';

const instrumentListSelector = createSelector(
  (state: State): Array<Track> => state.tracks.present,
  (tracks: Array<Track>): Array<string> => tracks.map(track => track.instrument)
);

export const makeAppSelector = () => {
  return createSelector(
    (state: State): Object => ({
      clipboard: state.clipboard,
      countdown: state.countdown,
      cursor: state.cursor,
      layout: state.layout,
      metronome: state.metronome,
      playingIndex: state.playingIndex,
      selectRange: state.selectRange,
      tuning: state.tracks.present[state.currentTrackIndex].tuning
    }),
    instrumentListSelector,
    trackWithLayoutSelector,
    (appState, instruments, measures) => {
      return { ...appState, instruments, measures };
    }
  );
};
