import * as types from './types';

export function deleteMeasure(measureIndex) {
  return {
    type: types.DELETE_MEASURE,
    measureIndex
  };
}

export function insertMeasure(index) {
  return {
    type: types.INSERT_MEASURE,
    index
  };
}

export function changeTuning(tuning) {
  return {
    type: types.CHANGE_TUNING,
    tuning
  };
}

export function setInstrument(instrument) {
  return {
    type: types.SET_INSTRUMENT,
    instrument
  };
}
