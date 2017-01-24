/* @flow */

export const INSERT_MEASURE = 'INSERT_MEASURE';
export const DELETE_MEASURE = 'DELETE_MEASURE';
export const CHANGE_TUNING = 'CHANGE_TUNING';
export const CHANGE_TEMPO = 'CHANGE_TEMPO';
export const CHANGE_TIME_SIGNATURE = 'CHANGE_TIME_SIGNATURE';
export const SET_INSTRUMENT = 'SET_INSTRUMENT';

import type { PlayingIndex, TimeSignature, Tuning } from '../util/stateTypes';
import type { Action } from './types';

export function insertMeasure(index: PlayingIndex): Action {
  return { type: INSERT_MEASURE, index };
}

export function deleteMeasure(measureIndex: number): Action {
  return { type: DELETE_MEASURE, measureIndex };
}

export function changeTuning(tuning: Tuning): Action {
  return { type: CHANGE_TUNING, tuning };
}

export function changeTempo(
  index: PlayingIndex,
  tempo: number,
  toEnd: boolean,
  all: boolean
): Action {
  return { type: CHANGE_TEMPO, index, tempo, toEnd, all };
}

export function changeTimeSignature(
  index: PlayingIndex,
  timeSignature: TimeSignature,
  toEnd: boolean,
  all: boolean
): Action {
  return { type: CHANGE_TIME_SIGNATURE, index, timeSignature, toEnd, all };
}

export function setInstrument(instrument: string): Action {
  return { type: SET_INSTRUMENT, instrument };
}
