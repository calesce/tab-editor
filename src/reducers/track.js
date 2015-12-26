import { computeMeasureWidths } from '../util';
import { DELETE_MEASURE, INSERT_MEASURE, REPLACE_SONG, CHANGE_TUNING } from '../actions/types';
import measure from './measure';

const replaceMeasure = (state, action) => {
  if(!action.index) {
    return state;
  }

  return state.map((m, index) => {
    if(index === action.index.measureIndex) {
      return measure(m, action);
    }
    return m;
  });
};

export default function track(state = {}, action) {
  switch(action.type) {
    case DELETE_MEASURE:
      return {
        measures: state.measures.filter((_, index) => index !== action.measureIndex),
        tuning: state.tuning
      };

    case INSERT_MEASURE:
      return {
        measures: computeMeasureWidths(state.measures.concat({ timeSignature: '4/4', notes: [] })),
        tuning: state.tuning
      };

    case REPLACE_SONG:
      return action.track;

    case CHANGE_TUNING:
      return Object.assign({}, state, { tuning: action.tuning });

    default:
      return {
        measures: computeMeasureWidths(replaceMeasure(state.measures, action)),
        tuning: state.tuning
      };
  }
}
