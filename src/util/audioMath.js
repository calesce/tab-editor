/* @flow */

import { orderBy, memoize } from 'lodash';

import type { TimeSignature, Measure } from './stateTypes';

const roundToFour = num => Number(Math.round(Number(num + 'e+3'))  + 'e-3');

const durations = {
  w: 1,
  h: 2,
  q: 4,
  e: 8,
  s: 16,
  t: 32
};

export const getPercentageOfNote = (duration: string, timeSignature: TimeSignature, dotted: boolean, tuplet: string): number => {
  const numBeats = timeSignature.beatType / durations[duration];
  let percentage = numBeats / timeSignature.beats;

  percentage = dotted ? percentage * 1.5 : percentage;
  if(tuplet) {
    percentage = percentage * (parseInt(tuplet[0]) / parseInt(tuplet[2]));
  }
  return percentage;
};

export const getDurationFromPercentage = (percentage: number, timeSignature: TimeSignature): number => {
  const numBeats = timeSignature.beats * percentage;
  return timeSignature.beatType / numBeats;
};

export const getReplaySpeedFromPercentage = (percentage: number, timeSignature: TimeSignature, bpm: number): number => {
  return 240000 / (bpm  * getDurationFromPercentage(percentage, timeSignature));
};

export const getBpmForNote = (note: number, bpm: number): number => (
  bpm * (note / 4)
);

export const numberOfTremoloNotesForDuration = (duration: string): number => {
  const sortedDurations = orderBy(Object.keys(durations), d => durations[d]);
  const index = sortedDurations.indexOf(duration);
  return durations[sortedDurations[sortedDurations.length - 1 - index]];
};

const getDurationValue = (duration: string): number => {
  switch(duration) {
    case 'q':
      return 0.25;
    case 'e':
      return 0.125;
    case 's':
      return 0.0625;
    case 'h':
     return 0.5;
    default:
     return 1.0;
  }
};

const calcMeasureValidity = (measure: Measure): boolean => {
  const timeSig = measure.timeSignature.beats / measure.timeSignature.beatType;
  const totalDuration = measure.notes.reduce((total, note) => {
    let duration = getDurationValue(note.duration);
    if(note.dotted) {
      duration *= 1.5;
    }
    if(note.tuplet) {
      duration = duration * (parseInt(note.tuplet[0]) / parseInt(note.tuplet[2]));
    }

    return total + duration;
  }, 0);

  return roundToFour(timeSig) === roundToFour(totalDuration);
};
export const memoizedValidity = memoize(calcMeasureValidity);
