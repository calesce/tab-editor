import { orderBy } from 'lodash';
import Fraction from 'fraction.js';

const durations = {
  w: 1,
  h: 2,
  q: 4,
  e: 8,
  s: 16,
  t: 32
};

export const getPercentageOfNote = (duration, timeSignature, dotted, tuplet) => {
  const numBeats = timeSignature.beatType / durations[duration];
  let percentage = Fraction(numBeats / timeSignature.beats);

  percentage = dotted ? percentage.mul(Fraction(1.5)) : percentage;
  if(tuplet) {
    percentage = percentage.mul(Fraction(tuplet));
  }
  return percentage.n / percentage.d;
};

export const getDurationFromPercentage = (percentage, timeSignature) => {
  const numBeats = timeSignature.beats * percentage;
  return timeSignature.beatType / numBeats;
};

export const getReplaySpeedFromPercentage = (percentage, timeSignature, bpm) => {
  return 240000 / (bpm  * getDurationFromPercentage(percentage, timeSignature));
};

export const getBpmForNote = (note, bpm) => {
  if(typeof note === 'string') {
    note = durations[note];
  }
  return bpm * (note / 4);
};

export const numberOfTremoloNotesForDuration = (duration) => {
  const sortedDurations = orderBy(Object.keys(durations), d => durations[d]);
  const index = sortedDurations.indexOf(duration);
  return durations[sortedDurations[sortedDurations.length - 1 - index]];
};

export const calcMeasureValidity = (measure) => {
  const timeSig = Fraction(measure.timeSignature.beats / measure.timeSignature.beatType);
  const totalDuration = measure.notes.reduce((total, note) => {
    let duration;
    switch(note.duration) {
      case 'q':
        duration = Fraction(0.25);
        break;
      case 'e':
        duration = Fraction(0.125);
        break;
      case 's':
        duration = Fraction(0.0625);
        break;
      case 'h':
       duration = Fraction(0.5);
       break;
      default:
       duration = Fraction(1.0);
    }

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
