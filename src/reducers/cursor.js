import { SET_CURSOR, MOVE_CURSOR_LEFT, MOVE_CURSOR_RIGHT,
MOVE_CURSOR_UP, MOVE_CURSOR_DOWN, DELETE_NOTE, DELETE_MEASURE,
CUT_NOTE, INSERT_NOTE } from '../actions/types';

import { getNextNote, getPrevNote, getUpperString, getLowerString } from '../util/cursor';

const initialState = {
  measureIndex: 0,
  noteIndex: 0,
  stringIndex: 0
};

export default function cursor(state = initialState, measures, tuning, action) {
  const { noteIndex, measureIndex } = state;

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
        stringIndex: getUpperString(state.stringIndex, tuning.length)
      };
    case MOVE_CURSOR_DOWN:
      return {
        ...state,
        stringIndex: getLowerString(state.stringIndex, tuning.length)
      };

    case INSERT_NOTE:
      if(measures[measureIndex].notes.length === 0) {
        return state;
      }
      return Object.assign({}, state, { noteIndex: state.noteIndex + 1 });

    case DELETE_NOTE: {
      const measure = measures[measureIndex];
      const note = measure.notes[noteIndex];
      if(note.fret[0] === 'rest' && noteIndex !== 0) {
        return getPrevNote(measures, state);
      }
      return state;
    }

    case DELETE_MEASURE:
      return getPrevNote(measures, state);

    case CUT_NOTE:
      if(measures[state.measureIndex].notes <= 1 || state.noteIndex === 0) {
        return state;
      }
      return getPrevNote(measures, state);

    default:
      return state;
  }
}
