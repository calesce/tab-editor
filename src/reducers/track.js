import { PASTE_NOTE, CUT_NOTE } from '../actions/cutCopyPaste';
import { INSERT_MEASURE, DELETE_MEASURE, CHANGE_TUNING,
  CHANGE_BPM, SET_INSTRUMENT, CHANGE_TIME_SIGNATURE } from '../actions/track';
import { REPLACE_SONG } from '../actions/tracks';
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

const changeBpmAllMeasures = (measures, bpm) => {
  return measures.map((measure) => ({
    ...measure,
    bpm
  }));
};

const changeBpmMeasuresAfterCurrent = (measures, bpm, measureIndex) => {
  return measures.map((measure, i) => {
    if(measureIndex > i) {
      return measure;
    }
    return {
      ...measure,
      bpm
    };
  });
};

const changeSingleBpmMeasure = (measures, bpm, measureIndex) => {
  return measures.map((measure, i) => {
    if(measureIndex === i) {
      return {
        ...measure,
        bpm
      };
    }
    return measure;
  });
};

const changeTimeSigAllMeasures = (measures, timeSignature) => {
  return measures.map((measure) => ({
    ...measure,
    timeSignature
  }));
};

const changeTimeSigMeasuresAfterCurrent = (measures, timeSignature, measureIndex) => {
  return measures.map((measure, i) => {
    if(measureIndex > i) {
      return measure;
    }
    return {
      ...measure,
      timeSignature
    };
  });
};

const changeSingleTimeSigMeasure = (measures, timeSignature, measureIndex) => {
  return measures.map((measure, i) => {
    if(measureIndex === i) {
      return {
        ...measure,
        timeSignature
      };
    }
    return measure;
  });
};

export default function track(state = {}, action) {
  switch(action.type) {
    case DELETE_MEASURE:
      return {
        ...state,
        measures: state.measures.filter((_, index) => index !== action.measureIndex)
      };

    case INSERT_MEASURE: {
      const lastMeasure = state.measures[state.measures.length - 1];

      return {
        ...state,
        measures: state.measures.concat({
          timeSignature: lastMeasure.timeSignature,
          bpm: lastMeasure.bpm,
          notes: []
        })
      };
    }

    case REPLACE_SONG:
      return action.track;

    case SET_INSTRUMENT:
      return Object.assign({}, state, { instrument: action.instrument });

    case CHANGE_TUNING:
      return Object.assign({}, state, { tuning: action.tuning });

    case CHANGE_BPM: {
      let newMeasures;
      if(action.all) {
        newMeasures = changeBpmAllMeasures(state.measures, action.bpm);
      } else if(action.toEnd) {
        newMeasures = changeBpmMeasuresAfterCurrent(state.measures, action.bpm, action.index.measureIndex);
      } else {
        newMeasures = changeSingleBpmMeasure(state.measures, action.bpm, action.index.measureIndex);
      }
      return {
        ...state,
        measures: newMeasures
      };
    }

    case CHANGE_TIME_SIGNATURE: {
      const { timeSignature, index } = action;

      let newMeasures;
      if(action.all) {
        newMeasures = changeTimeSigAllMeasures(state.measures, timeSignature);
      } else if(action.toEnd) {
        newMeasures = changeTimeSigMeasuresAfterCurrent(state.measures, timeSignature, index.measureIndex);
      } else {
        newMeasures = changeSingleTimeSigMeasure(state.measures, timeSignature, index.measureIndex);
      }

      return {
        ...state,
        measures: newMeasures
      };
    }

    case PASTE_NOTE: {
      const { index, clipboard } = action;

      if(Array.isArray(clipboard)) {
        const measures = state.measures.slice(0, index.measureIndex + 1).concat(clipboard).concat(state.measures.slice(index.measureIndex + 1, state.measures.length));
        return {
          ...state,
          measures
        };
      } else {
        return {
          ...state,
          measures: replaceMeasure(state.measures, action)
        };
      }
    }

    case CUT_NOTE: {
      const { selection, range } = action;

      if(!selection) {
        return {
          ...state,
          measures: state.measures.filter((_, index) => index !== action.index.measureIndex)
        };
      } else if(Array.isArray(selection)) {
        const mappedMeasures = state.measures.map((measure, i) => {
          if(range[i]) {
            if(range[i] !== 'all') {
              const notes = measure.notes.filter((_, j) => {
                return range[i].indexOf(j) === -1;
              });
              return {
                ...measure,
                notes
              };
            }
          }
          return measure;
        });

        const filteredMeasures = mappedMeasures.filter((measure, i) => {
          if(range[i]) {
            if(range[i] === 'all') {
              return false;
            }
          }
          return measure.notes.length;
        });

        if(filteredMeasures.length === 0) {
          return {
            ...state,
            measures: [{
              ...mappedMeasures[0],
              notes: []
            }]
          };
        }
        return {
          ...state,
          measures: filteredMeasures
        };
      } else {
        return {
          ...state,
          measures: replaceMeasure(state.measures, action)
        };
      }
    }

    default:
      return {
        measures: replaceMeasure(state.measures, action),
        tuning: state.tuning,
        instrument: state.instrument
      };
  }
}
