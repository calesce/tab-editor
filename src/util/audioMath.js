/* @flow */

import { orderBy } from 'lodash';
import Fraction from 'fraction.js';

type TimeSignature = { beats: number, beatType: number };

const durations = {
  w: 1,
  h: 2,
  q: 4,
  e: 8,
  s: 16,
  t: 32
};

export const getPercentageOfNote = (duration: string, timeSignature: TimeSignature, dotted: boolean, tuplet: boolean): number => {
  const numBeats = timeSignature.beatType / durations[duration];
  let percentage = Fraction(numBeats / timeSignature.beats);

  percentage = dotted ? percentage.mul(Fraction(1.5)) : percentage;
  if(tuplet) {
    percentage = percentage.mul(Fraction(tuplet));
  }
  return percentage.n / percentage.d;
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

const getDurationFraction = (duration: string): any => {
  switch(duration) {
    case 'q':
      return Fraction(0.25);
    case 'e':
      return Fraction(0.125);
    case 's':
      return Fraction(0.0625);
    case 'h':
     return Fraction(0.5);
    default:
     return Fraction(1.0);
  }
};

export const calcMeasureValidity = (measure: Object): boolean => {
  const timeSig = Fraction(measure.timeSignature.beats / measure.timeSignature.beatType);
  const totalDuration = measure.notes.reduce((total, note) => {
    let duration = getDurationFraction(note.duration);
    if(note.dotted) {
      duration = duration.mul(Fraction(1.5));
    }
    if(note.tuplet) {
      duration = duration.mul(Fraction(note.tuplet));
    }

    return total + duration;
  }, Fraction(0));

  return timeSig.equals(totalDuration);
};
