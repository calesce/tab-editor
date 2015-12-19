import _ from 'lodash';
import { CHANGE_NOTE, DELETE_NOTE, DELETE_MEASURE, INSERT_MEASURE, CHANGE_NOTE_LENGTH, INSERT_NOTE,
  CHANGE_TIME_SIGNATURE, TOGGLE_NOTE_DOTTED, REPLACE_SONG
} from '../actions/types';
import measure from './measure';

const replaceMeasure = (state, action) => {
  return state.map((m, index) => {
    if(index === action.index.measureIndex) {
      return measure(m, action);
    }
    return m;
  });
};

export default function track(state = [], action) {
  switch(action.type) {
    case DELETE_MEASURE:
      return state.filter((_, index) => index !== action.measureIndex);

    case INSERT_MEASURE:
      return state.concat({ timeSignature: '4/4', notes: [] });

    case REPLACE_SONG:
      return action.song;

    case CHANGE_TIME_SIGNATURE:
      return replaceMeasure(state, action);

    case CHANGE_NOTE:
      return replaceMeasure(state, action);

    case DELETE_NOTE:
      return replaceMeasure(state, action);

    case CHANGE_NOTE_LENGTH:
      return replaceMeasure(state, action);

    case INSERT_NOTE:
      return replaceMeasure(state, action);

    case TOGGLE_NOTE_DOTTED:
      return replaceMeasure(state, action);

    default:
      return state;
  }
}
