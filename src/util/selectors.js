import { createSelector } from 'reselect';

export function timeSignatureSelector(state) {
  const measures = state.tracks[state.currentTrackIndex].measures;
  const measureIndex = state.cursor.measureIndex;
  return measures[measureIndex] ? measures[measureIndex].timeSignature : '4/4';
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

const measureSelector = (state, props) => {
  let measureIndex;
  if(state.tracks[state.currentTrackIndex].measures.length - 1 < props.measureIndex) {
    measureIndex = props.measureIndex - 1;
  } else {
    measureIndex = props.measureIndex;
  }
  return {
    measure: state.tracks[state.currentTrackIndex].measures[measureIndex],
    measureIndex
  };
};

const playingNoteSelector = state => state.playingNote;
const cursorSelector = state => state.cursor;

export const finalMeasureSelector = createSelector(
  measureSelector,
  playingNoteSelector,
  cursorSelector,
  ({ measure, measureIndex }, playingNote, cursor) => {
    let newPlayingNote, newCursor;
    if(playingNote) {
      newPlayingNote = playingNote.measure === measureIndex ? playingNote : undefined;
    } else {
      newCursor = cursor.measureIndex === measureIndex ? cursor : undefined;
    }

    return {
      measure,
      playingNote: newPlayingNote,
      cursor: newCursor,
      isValid: calcMeasureValidity(measure)
    };
  }
);
