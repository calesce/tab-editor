const getSpeedFromBpm = (bpm) => {
  return 60000 / bpm;
};

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

export const getBpmOfPercentage = (percentage, timeSignature) => {
  const numBeats = timeSignature.beats * percentage;
  return timeSignature.beatType / numBeats;
};

export const getReplaySpeedForNote = (note, bpm) => {
  let replaySpeed;
  switch(note.duration) {
    case 'w':
      replaySpeed = getSpeedFromBpm(bpm) * 4;
      break;
    case 'h':
      replaySpeed = getSpeedFromBpm(bpm) * 2;
      break;
    case 'q':
      replaySpeed = getSpeedFromBpm(bpm);
      break;
    case 'e':
      replaySpeed = getSpeedFromBpm(bpm) / 2;
      break;
    case 's':
      replaySpeed = getSpeedFromBpm(bpm) / 4;
      break;
    default:
      replaySpeed = getSpeedFromBpm(bpm) / 8;
  }

  if(note.dotted) {
    replaySpeed = getSpeedFromBpm(bpm) * 1.5;
  }

  return replaySpeed;
};

export const getBpmForNote1 = (note, bpm) => {
  const replaySpeed = bpm * (note / 4);
  return note.dotted ? replaySpeed / 1.5 : replaySpeed;
};

export const getBpmForNote = (note, bpm) => {
  let replaySpeed = bpm;
  if(note.duration === 'h') {
    replaySpeed = bpm / 2;
  } else if(note.duration === 'w') {
    replaySpeed = bpm / 4;
  } else if(note.duration === 'e') {
    replaySpeed = bpm * 2;
  } else if(note.duration === 's') {
    replaySpeed = bpm * 4;
  } else if(note.duration === 't') {
    replaySpeed = bpm * 8;
  }

  if(note.dotted) {
    replaySpeed = replaySpeed / 1.5;
  }

  return replaySpeed;
};

export const mapDurationToNote = (duration) => {
  switch(duration) {
    case 's':
      return 2;
    case 'e':
      return 4;
    case 'q':
      return 8;
    case 'h':
      return 16;
    case 'w':
      return 32;
    default:
      return 1;
  }
};
