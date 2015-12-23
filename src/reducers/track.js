import _ from 'lodash';
import { DELETE_MEASURE, INSERT_MEASURE, REPLACE_SONG } from '../actions/types';
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
      return state.measures.filter((_, index) => index !== action.measureIndex);

    case INSERT_MEASURE:
      return state.measures.concat({ timeSignature: '4/4', notes: [] });

    case REPLACE_SONG:
      return action.track;

    default:
      return replaceMeasure(state.measures, action);
  }
}
