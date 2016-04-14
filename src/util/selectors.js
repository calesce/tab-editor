import { createSelector } from 'reselect';
import { findIndex } from 'lodash';

export function timeSignatureSelector(state) {
  const measures = state.tracks[state.currentTrackIndex].measures;
  const measureIndex = state.cursor.measureIndex;
  return measures.length > 0 ? measures[measureIndex].timeSignature : '4/4';
}

const calcMeasureValidity = (measure) => {
  const timeSig = parseInt(measure.timeSignature[0]) / parseInt(measure.timeSignature.slice(2, 4));
  const notesTotal = measure.notes.reduce((total, note) => {
    let duration;
    switch(note.duration) {
      case 'q':
        duration = 0.25;
        break;
      case 'e':
        duration = 0.125;
        break;
      case 's':
        duration = 0.0625;
        break;
      case 'h':
       duration = 0.5;
       break;
      default:
       duration = 1.0;
    }

    if(note.dotted) {
      duration *= 1.5;
    }

    return total + duration;
  }, 0);

  return timeSig === notesTotal;
};

const currentMeasureSelector = state => state.tracks[state.currentTrackIndex].measures;
const measureIndexSelector = (_, props) => props.measureIndex;

const measureSelector = createSelector(
  currentMeasureSelector, measureIndexSelector,
  (measures, propsMeasureIndex) => {
  let measureIndex;
  if(measures.length - 1 < propsMeasureIndex) {
    measureIndex = propsMeasureIndex - 1;
  } else {
    measureIndex = propsMeasureIndex;
  }
  return {
    measure: measures[measureIndex],
    measureIndex
  };
});

const playingIndexSelector = state => state.playingIndex;
const cursorSelector = state => state.cursor;
const tuningSelector = state => state.tracks[state.currentTrackIndex].tuning;
const measureLengthSelector = state => state.tracks[state.currentTrackIndex].measures.length;
const selectRangeSelector = state => state.selectRange;

export const finalMeasureSelector = createSelector(
  measureSelector,
  playingIndexSelector,
  tuningSelector,
  measureLengthSelector,
  selectRangeSelector,
  ({ measure, measureIndex }, playingIndex, tuning, measureLength, selectRange) => {
    let playingNoteIndex;
    if(playingIndex) {
      playingNoteIndex = playingIndex.measureIndex === measureIndex ? playingIndex.noteIndex : undefined;
    }

    return {
      measure,
      playingNoteIndex,
      isValid: calcMeasureValidity(measure),
      tuning,
      measureLength,
      selectRange: selectRange ? selectRange[measureIndex] : undefined 
    };
  }
);

export const cursorSelectorForMeasure = createSelector(
  measureSelector,
  cursorSelector,
  playingIndexSelector,
  ({ measureIndex }, cursor, playingIndex) => {
    return !playingIndex && cursor.measureIndex === measureIndex ? { cursor }: { cursor: undefined };
});

const tracksSelector = state => state.tracks;
const currentTrackIndexSelector = state => state.currentTrackIndex;

const mapMeasureIndices = (measures) => {
  return measures.map((measure, i) => {
    return {
      ...measure,
      measureIndex: i
    };
  });
};

const getRepeatingSection = (measures, repeatIndex) => {
  return repeatIndex === -1 ? [] : measures.slice(0, repeatIndex + 1);
};

const tracksWithMeasuresSelector = createSelector(
  tracksSelector,
  (tracks) => {
    return tracks.map((track) => {
      return {
        ...track,
        measures: mapMeasureIndices(track.measures)
      };
    });
  }
);

const measuresTuningLayoutSelector = state => (
  {
    measures: state.tracks[state.currentTrackIndex].measures,
    tuning: state.tracks[state.currentTrackIndex].tuning,
    layout: state.layout
  }
);

const calcHeight = (measures, tuning) => {
  return (measures[measures.length - 1].rowIndex + 1) * (210 + 20 * tuning.length);
};

const calcWidth = (measures) => {
  return measures.reduce((width, measure) => {
    return measure.width + width;
  }, 20);
};

export const scoreSelector = createSelector(
  measuresTuningLayoutSelector,
  ({ measures, tuning, layout }) => {
    return {
      measures,
      rowHeight: 20 * tuning.length + 210,
      height: layout === 'linear' ? '100% - 10' : calcHeight(measures, tuning),
      width: layout === 'linear' ? calcWidth(measures) : window.innerWidth - 10
    };
  }
);

export const expandedTracksSelector = createSelector(
  tracksSelector,
  tracksWithMeasuresSelector,
  playingIndexSelector,
  currentTrackIndexSelector,
  (tracks, tracksWithMeasures, playingIndex, currentTrackIndex) => {
    const repeatIndex = findIndex(tracksWithMeasures[0].measures, (measure) => measure.repeatEnd === true);

    let expandedTracks;
    if(repeatIndex === -1) {
      expandedTracks = tracksWithMeasures;
    } else {
      expandedTracks = tracksWithMeasures.map((track) => {
        const { measures } = track;
        const repeatSection = getRepeatingSection(measures, repeatIndex);
        const newMeasures = measures.slice(0, repeatIndex + 1).concat(repeatSection).concat(measures.slice(repeatIndex + 1), measures.length);
        return {
          ...track,
          measures: newMeasures
        };
      });
    }

    const newMeasureIndex = findIndex(expandedTracks[currentTrackIndex].measures, (measure) =>
      measure.measureIndex === playingIndex.measureIndex
    );
    const newPlayingIndex = {
      measureIndex: newMeasureIndex,
      noteIndex: playingIndex.noteIndex
    };

    return {
      playingIndex: newPlayingIndex,
      tracks,
      currentTrackIndex,
      expandedTracks
    };
  }
);
