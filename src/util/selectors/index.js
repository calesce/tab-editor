export const makeMapStateToProps = selectorFactory => () => {
  const newSelector = selectorFactory();
  return (state, props) => newSelector(state, props);
};

export const timeSignatureSelector = state => {
  const measures = state.tracks.present[state.currentTrackIndex].measures;
  const measureIndex = state.cursor.measureIndex;
  return measures.length > 0
    ? measures[measureIndex].timeSignature
    : { beats: 4, beatType: 4 };
};

export const measureIndexSelector = (_, props) => props.measureIndex;
export const playingIndexSelector = state => state.playingIndex;
export const cursorSelector = state => state.cursor;
export const tuningSelector = state =>
  state.tracks.present[state.currentTrackIndex].tuning;
export const measureLengthSelector = state =>
  state.tracks.present[state.currentTrackIndex].measures.length;
export const trackMeasuresSelector = state =>
  state.tracks.present[state.currentTrackIndex].measures;
export const selectRangeSelector = state => state.selectRange;
export const layoutSelector = state => state.layout;
