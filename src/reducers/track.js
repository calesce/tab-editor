import { prepareRows } from '../util';
import { DELETE_MEASURE, INSERT_MEASURE, REPLACE_SONG, CHANGE_TUNING, CHANGE_BPM } from '../actions/types';
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

const changeAllMeasures = (measures, bpm) => {
  return measures.map((measure) => ({
    ...measure,
    bpm: bpm
  }));
};

const changeMeasuresAfterCurrent = (measures, bpm, measureIndex) => {
  return measures.map((measure, i) => {
    if(measureIndex > i) {
      return measure;
    }
    return {
      ...measure,
      bpm: bpm
    };
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
      const lastMeasure = state.measures[state.measures.length - 1];

      return {
        measures: prepareRows(state.measures.concat({
          timeSignature: lastMeasure.timeSignature,
          bpm: lastMeasure.bpm,
          notes: []
        })),
        tuning: state.tuning
      };

    case REPLACE_SONG:
      return action.track;

    case CHANGE_TUNING:
      return Object.assign({}, state, { tuning: action.tuning });

    case CHANGE_BPM:
      let newMeasures = action.all ? changeAllMeasures(state.measures, action.bpm)
                                   : changeMeasuresAfterCurrent(state.measures, action.bpm, action.index.measureIndex);
      return {
        ...state,
        measures: prepareRows(newMeasures)
      };

    default:
      return {
        measures: prepareRows(replaceMeasure(state.measures, action)),
        tuning: state.tuning
      };
  }
}
