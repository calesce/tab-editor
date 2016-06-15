export const INSERT_MEASURE = 'INSERT_MEASURE';
export const DELETE_MEASURE = 'DELETE_MEASURE';
export const CHANGE_TUNING = 'CHANGE_TUNING';
export const CHANGE_BPM = 'CHANGE_BPM';
export const CHANGE_TIME_SIGNATURE = 'CHANGE_TIME_SIGNATURE';
export const SET_INSTRUMENT = 'SET_INSTRUMENT';

export function insertMeasure(index) {
  return {
    type: INSERT_MEASURE,
    index
  };
}

export function deleteMeasure(measureIndex) {
  return {
    type: DELETE_MEASURE,
    measureIndex
  };
}

export function changeTuning(tuning) {
  return {
    type: CHANGE_TUNING,
    tuning
  };
}

export function changeBpm(index, bpm, all) {
  return {
    type: CHANGE_BPM,
    index,
    bpm,
    all
  };
}

export function changeTimeSignature(index, timeSignature, toEnd, all) {
  return {
    type: CHANGE_TIME_SIGNATURE,
    index,
    timeSignature,
    toEnd,
    all
  };
}

export function setInstrument(instrument) {
  return {
    type: SET_INSTRUMENT,
    instrument
  };
}
