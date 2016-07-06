import { createSelector } from 'reselect';

export const makeMapStateToProps = (selectorFactory) => () => {
  const newSelector = selectorFactory();
  return (state, props) => newSelector(state, props);
};

export const timeSignatureSelector = (state) => {
  const measures = state.tracks.present[state.currentTrackIndex].measures;
  const measureIndex = state.cursor.measureIndex;
  return measures.length > 0 ? measures[measureIndex].timeSignature : { beats: 4, beatType: 4 };
};

export const measureIndexSelector = (_, props) => props.measureIndex;
export const scoreBoxSelector = state => state.scoreBox;
export const playingIndexSelector = state => state.playingIndex;
export const cursorSelector = state => state.cursor;
export const tuningSelector = state => state.tracks.present[state.currentTrackIndex].tuning;
export const measureLengthSelector = state => state.tracks.present[state.currentTrackIndex].measures.length;
export const selectRangeSelector = state => state.selectRange;
export const layoutSelector = state => state.layout;

const instrumentListSelector = createSelector(
  state => state.tracks.present,
  tracks => tracks.map(track => track.instrument)
);

export const makeAppSelector = () => {
  return createSelector(
    state => ({
      measures: state.tracks.present[state.currentTrackIndex].measures,
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
    (appState, instruments) => {
      return {
        ...appState,
        instruments
      };
    }
  );
};
