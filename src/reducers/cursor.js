import { SET_CURSOR, MOVE_CURSOR_LEFT, MOVE_CURSOR_RIGHT,
MOVE_CURSOR_UP, MOVE_CURSOR_DOWN, DELETE_NOTE, DELETE_MEASURE,
PASTE_NOTE, CUT_NOTE } from '../actions/types';

const getNextNote = (measures, { stringIndex, measureIndex, noteIndex }) => {
  if(noteIndex >= measures[measureIndex].notes.length - 1) {
    return {
      measureIndex: measureIndex + 1,
      noteIndex: 0,
      stringIndex
    };
  } else {
    return {
      measureIndex,
      noteIndex: noteIndex + 1,
      stringIndex
    };
  }
};

const getPrevNote = (measures, { stringIndex, measureIndex, noteIndex }) => {
  if(measureIndex === 0 && noteIndex === 0) {
    return { measureIndex, noteIndex, stringIndex };
  } else if(noteIndex === 0) {
    let prevMeasure = measures[measureIndex - 1];
    if(prevMeasure.notes.length > 0) {
      return {
        measureIndex: measureIndex - 1,
        noteIndex: measures[measureIndex - 1].notes.length - 1,
        stringIndex
      };
    } else {
      return {
        measureIndex: measureIndex - 1,
        noteIndex: 0,
        stringIndex
      };
    }
  } else {
    return {
      measureIndex,
      noteIndex: noteIndex - 1,
      stringIndex
    };
  }
};

const getUpperString = (stringIndex) => {
  return stringIndex === 5 ? 0 : stringIndex + 1;
};

const getLowerString = (stringIndex) => {
  return stringIndex === 0 ? 5 : stringIndex - 1;
};

const initialState = {
  measureIndex: 0,
  noteIndex: 0,
  stringIndex: 0
};

export default function cursor(state = initialState, measures, action) {
  const { noteIndex, measureIndex, stringIndex } = state;

  switch(action.type) {
    case SET_CURSOR:
      return action.index;
    case MOVE_CURSOR_LEFT:
      return getPrevNote(measures, state);
    case MOVE_CURSOR_RIGHT:
      return getNextNote(measures, state);
    case MOVE_CURSOR_UP:
      return {
        ...state,
        stringIndex: getUpperString(state.stringIndex)
      };
    case MOVE_CURSOR_DOWN:
      return {
        ...state,
        stringIndex: getLowerString(state.stringIndex)
      };
    case DELETE_NOTE:
      const measure = measures[measureIndex];
      const note = measure.notes[noteIndex];
      if(note.fret[0] === 'rest' && noteIndex !== 0) {
        return getPrevNote(measures, state);
      }
      return state;

    case DELETE_MEASURE:
      return getPrevNote(measures, state);

    case PASTE_NOTE:
      if(noteIndex === measures[measureIndex].notes.length - 1) {
        return {
          measureIndex,
          noteIndex: noteIndex + 1,
          stringIndex
        };
      }
      return getNextNote(measures, state);

    case CUT_NOTE:
      if(measures[state.measureIndex].notes === 0 || state.noteIndex === 0) {
        return state;
      }
      return getPrevNote(measures, state);

    default:
      return state;
  }
}
