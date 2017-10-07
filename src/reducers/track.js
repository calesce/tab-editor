/* @flow */

import { PASTE_NOTE, CUT_NOTE } from '../actions/cutCopyPaste';
import {
  INSERT_MEASURE,
  DELETE_MEASURE,
  CHANGE_TUNING,
  CHANGE_TEMPO,
  SET_INSTRUMENT,
  CHANGE_TIME_SIGNATURE
} from '../actions/track';
import measure from './measure';

import type { Track, Measure, TimeSignature } from '../util/stateTypes';

const replaceMeasure = (
  state: Array<Measure>,
  action: Object
): Array<Measure> => {
  if (!action.index) {
    return state;
  }

  return state.map((m, index) => {
    if (index === action.index.measureIndex) {
      return measure(m, action);
    }
    return m;
  });
};

const changeTempoAllMeasures = (
  measures: Array<Measure>,
  tempo: number
): Array<Measure> => {
  return measures.map(measure => ({ ...measure, tempo }));
};

const changeTempoMeasuresAfterCurrent = (
  measures: Array<Measure>,
  tempo: number,
  measureIndex: number
): Array<Measure> => {
  return measures.map((measure, i) => {
    if (measureIndex > i) {
      return measure;
    }
    return { ...measure, tempo };
  });
};

const changeSingleTempoMeasure = (
  measures: Array<Measure>,
  tempo: number,
  measureIndex: number
): Array<Measure> => {
  return measures.map((measure, i) => {
    if (measureIndex === i) {
      return { ...measure, tempo };
    }
    return measure;
  });
};

const changeTimeSigAllMeasures = (
  measures: Array<Measure>,
  timeSignature: TimeSignature
): Array<Measure> => {
  return measures.map(measure => ({ ...measure, timeSignature }));
};

const changeTimeSigMeasuresAfterCurrent = (
  measures: Array<Measure>,
  timeSignature: TimeSignature,
  measureIndex: number
): Array<Measure> => {
  return measures.map((measure, i) => {
    if (measureIndex > i) {
      return measure;
    }
    return { ...measure, timeSignature };
  });
};

const changeSingleTimeSigMeasure = (
  measures: Array<Measure>,
  timeSignature: TimeSignature,
  measureIndex: number
): Array<Measure> => {
  return measures.map((measure, i) => {
    if (measureIndex === i) {
      return { ...measure, timeSignature };
    }
    return measure;
  });
};

export default function track(state: Track, action: Object): Track {
  switch (action.type) {
    case DELETE_MEASURE: {
      return {
        ...state,
        measures: state.measures.filter(
          (_, index) => index !== action.measureIndex
        )
      };
    }

    case INSERT_MEASURE: {
      const lastMeasure = state.measures[state.measures.length - 1];

      return {
        ...state,
        measures: state.measures.concat({
          timeSignature: lastMeasure.timeSignature,
          tempo: lastMeasure.tempo,
          notes: []
        })
      };
    }

    case SET_INSTRUMENT: {
      return { ...state, instrument: action.instrument };
    }

    case CHANGE_TUNING: {
      return { ...state, tuning: action.tuning };
    }

    case CHANGE_TEMPO: {
      let newMeasures;
      if (action.all) {
        newMeasures = changeTempoAllMeasures(state.measures, action.tempo);
      } else if (action.toEnd) {
        newMeasures = changeTempoMeasuresAfterCurrent(
          state.measures,
          action.tempo,
          action.index.measureIndex
        );
      } else {
        newMeasures = changeSingleTempoMeasure(
          state.measures,
          action.tempo,
          action.index.measureIndex
        );
      }
      return { ...state, measures: newMeasures };
    }

    case CHANGE_TIME_SIGNATURE: {
      const { timeSignature, index } = action;

      let newMeasures;
      if (action.all) {
        newMeasures = changeTimeSigAllMeasures(state.measures, timeSignature);
      } else if (action.toEnd) {
        newMeasures = changeTimeSigMeasuresAfterCurrent(
          state.measures,
          timeSignature,
          index.measureIndex
        );
      } else {
        newMeasures = changeSingleTimeSigMeasure(
          state.measures,
          timeSignature,
          index.measureIndex
        );
      }

      return { ...state, measures: newMeasures };
    }

    case PASTE_NOTE: {
      const { index, clipboard } = action;

      if (Array.isArray(clipboard)) {
        const measures = state.measures
          .slice(0, index.measureIndex + 1)
          .concat(clipboard)
          .concat(
            state.measures.slice(index.measureIndex + 1, state.measures.length)
          );
        return { ...state, measures };
      } else {
        return { ...state, measures: replaceMeasure(state.measures, action) };
      }
    }

    case CUT_NOTE: {
      const { selection, range } = action;

      if (!selection) {
        return {
          ...state,
          measures: state.measures.filter(
            (_, index) => index !== action.index.measureIndex
          )
        };
      } else if (Array.isArray(selection)) {
        const mappedMeasures = state.measures.map((measure, i) => {
          if (range[i]) {
            if (range[i] !== 'all') {
              const notes = measure.notes.filter((_, j) => {
                return range[i].indexOf(j) === -1;
              });
              return { ...measure, notes };
            }
          }
          return measure;
        });

        const filteredMeasures = mappedMeasures.filter((measure, i) => {
          if (range[i]) {
            if (range[i] === 'all') {
              return false;
            }
          }
          return measure.notes.length;
        });

        if (filteredMeasures.length === 0) {
          return { ...state, measures: [{ ...mappedMeasures[0], notes: [] }] };
        }
        return { ...state, measures: filteredMeasures };
      } else {
        return { ...state, measures: replaceMeasure(state.measures, action) };
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
