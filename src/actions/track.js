/* @flow */

export const INSERT_MEASURE = 'INSERT_MEASURE';
export const DELETE_MEASURE = 'DELETE_MEASURE';
export const CHANGE_TUNING = 'CHANGE_TUNING';
export const CHANGE_BPM = 'CHANGE_BPM';
export const CHANGE_TIME_SIGNATURE = 'CHANGE_TIME_SIGNATURE';
export const SET_INSTRUMENT = 'SET_INSTRUMENT';

import type { PlayingIndex, TimeSignature, Tuning } from '../util/stateTypes';

export function insertMeasure(index: PlayingIndex) {
  return {
    type: INSERT_MEASURE,
    index
  };
}

export function deleteMeasure(measureIndex: number) {
  return {
    type: DELETE_MEASURE,
    measureIndex
  };
}

export function changeTuning(tuning: Tuning) {
  return {
    type: CHANGE_TUNING,
    tuning
  };
}

export function changeBpm(index: PlayingIndex, bpm: number, toEnd: boolean, all: boolean) {
  return {
    type: CHANGE_BPM,
    index, bpm, toEnd, all
  };
}

export function changeTimeSignature(index: PlayingIndex, timeSignature: TimeSignature, toEnd: boolean, all: boolean) {
  return {
    type: CHANGE_TIME_SIGNATURE,
    index, timeSignature, toEnd, all
  };
}

export function setInstrument(instrument: string) {
  return {
    type: SET_INSTRUMENT,
    instrument
  };
}
