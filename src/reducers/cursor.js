/* @flow */

import {
  SET_CURSOR,
  MOVE_CURSOR_LEFT,
  MOVE_CURSOR_RIGHT,
  MOVE_CURSOR_UP,
  MOVE_CURSOR_DOWN,
  SET_SELECT_RANGE
} from '../actions/cursor';
import { DELETE_MEASURE } from '../actions/track';
import { DELETE_NOTE, INSERT_NOTE } from '../actions/measure';

import {
  getNextNote,
  getPrevNote,
  getUpperString,
  getLowerString
} from '../util/cursor';
import type { Cursor, Measure, Tuning } from '../util/stateTypes';
import type { Action } from '../actions/types';

const initialState = { measureIndex: 0, noteIndex: 0, stringIndex: 0 };

export default function cursor(
  state: Cursor = initialState,
  action: Action,
  measures: Array<Measure>,
  tuning: Tuning
): Cursor {
  const { noteIndex, measureIndex } = state;

  switch (action.type) {
    case SET_CURSOR: {
      return action.index;
    }
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

    case SET_SELECT_RANGE: {
      if (action.range) {
        const measureIndex = parseInt(Object.keys(action.range)[0]);
        if (action.range[measureIndex] === 'all') {
          return { ...state, measureIndex, noteIndex: 0 };
        } else {
          return {
            ...state,
            measureIndex,
            noteIndex: action.range[measureIndex][0]
          };
        }
      }

      return state;
    }

    case INSERT_NOTE: {
      if (measures[measureIndex].notes.length === 0) {
        return state;
      }
      return { ...state, noteIndex: state.noteIndex + 1 };
    }

    case DELETE_NOTE: {
      const measure = measures[measureIndex];
      const note = measure.notes[noteIndex];
      if (note.fret[0] === 'rest' && noteIndex !== 0) {
        return getPrevNote(measures, state);
      }
      return state;
    }

    case DELETE_MEASURE: {
      return getPrevNote(measures, state);
    }

    default:
      return state;
  }
}
