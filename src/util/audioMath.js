const getSpeedFromBpm = (bpm) => {
  return 60000 / bpm;
};

export const getReplaySpeedForNote = (notes, noteIndex, bpm) => {
  if(notes.length === 0) {
    return bpm * 4;
  }
  const noteLength = notes[noteIndex].duration;

  let replaySpeed = getSpeedFromBpm(bpm);
  if(noteLength === 'h') {
    replaySpeed = replaySpeed * 2;
  } else if(noteLength === 'w') {
    replaySpeed = replaySpeed * 4;
  } else if(noteLength === 'e') {
    replaySpeed = replaySpeed / 2;
  } else if(noteLength === 's') {
    replaySpeed = replaySpeed / 4;
  } else if(noteLength === 't') {
    replaySpeed = replaySpeed / 8;
  }

  if(notes[noteIndex].dotted) {
    replaySpeed = replaySpeed * 1.5;
  }

  return replaySpeed;
};

export const getBpmForNote =(notes, noteIndex, bpm) => {
  if(notes.length === 0) {
    return bpm * 4;
  }
  const noteLength = notes[noteIndex].duration;

  let replaySpeed = bpm;
  if(noteLength === 'h') {
    replaySpeed = replaySpeed / 2;
  } else if(noteLength === 'w') {
    replaySpeed = replaySpeed / 4;
  } else if(noteLength === 'e') {
    replaySpeed = replaySpeed * 2;
  } else if(noteLength === 's') {
    replaySpeed = replaySpeed * 4;
  } else if(noteLength === 't') {
    replaySpeed = replaySpeed * 8;
  }

  if(notes[noteIndex].dotted) {
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
