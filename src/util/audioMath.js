import { orderBy } from 'lodash';

const durations = {
  w: 1,
  h: 2,
  q: 4,
  e: 8,
  s: 16,
  t: 32
};

export const getPercentageOfNote = (duration, timeSignature, dotted) => {
  const numBeats = timeSignature.beatType / durations[duration];
  const percentage = numBeats / timeSignature.beats;
  return dotted ? percentage * 1.5 : percentage;
};

export const getDurationFromPercentage = (percentage, timeSignature) => {
  const numBeats = timeSignature.beats * percentage;
  return timeSignature.beatType / numBeats;
};

export const getReplaySpeedForNote = (duration, bpm, dotted) => {
  const sortedDurations = orderBy(Object.keys(durations), d => durations[d], 'desc');
  const replaySpeed = (60000 / bpm) * Math.pow(2, sortedDurations.indexOf(duration) - 3);
  return dotted ? replaySpeed * 1.5 : replaySpeed;
};

export const getBpmForNote = (note, bpm, dotted) => {
  if(typeof note === 'string') {
    note = durations[note];
  }
  const replaySpeed = bpm * (note / 4);
  return dotted ? replaySpeed / 1.5 : replaySpeed;
};

export const numberOfTremoloNotesForDuration = (duration) => {
  const sortedDurations = orderBy(Object.keys(durations), d => durations[d]);
  const index = sortedDurations.indexOf(duration);
  return durations[sortedDurations[sortedDurations.length - 1 - index]];
};
