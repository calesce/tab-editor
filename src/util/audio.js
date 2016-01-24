import { getIndexOfNote } from './midiNotes';
import audioContext from './audioContext';

const getSpeedFromBpm = (bpm) => {
  return 60000 / bpm;
};

exports.getReplaySpeedForNote = (notes, noteIndex, bpm) => {
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

const playVibrato = (source, startTime, endTime) => {
  let freqGain = audioContext.createGain();
  let lfo = audioContext.createOscillator();
  freqGain.gain.value = 20; // range of vibrato
  freqGain.connect(source.detune);
  lfo.frequency.value = 4; // fast vibrato
  lfo.type = 'square';
  lfo.connect(freqGain);

  lfo.start(startTime);
  lfo.stop(endTime);
};

const playWithBuffer = (startTime, buffer, duration, vibrato) => {
  let endTime = startTime + duration;

  let source = audioContext.createBufferSource();
  source.buffer = buffer;
  let gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);
  source.connect(gainNode);

  if(vibrato) {
    playVibrato(source, startTime, endTime);
  }

  source.start(startTime);
  source.stop(endTime);
};

const play = (startTime, pitch, duration) => {
  let endTime = startTime + duration;

  let oscillator = audioContext.createOscillator();
  let gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if(pitch !== 'rest') {
    oscillator.type = 'square';
    oscillator.detune.value = (pitch - 29) * 100;

    gainNode.gain.value = 0.025;
  } else {
    gainNode.gain.value = 0;
  }

  oscillator.start(startTime);
  oscillator.stop(endTime);
};

const playNoteAtTime = (currentNote, playTime, duration, buffers, tuning) => {
  if(currentNote === 'rest') {
    return play(playTime, 'rest', duration / 1000);
  }

  for(let i = 0; i < currentNote.string.length; i++) {
    const openString = tuning[currentNote.string[i]];
    const noteToPlay = getIndexOfNote(openString) + currentNote.fret[i];

    playWithBuffer(playTime, buffers[noteToPlay], duration / 1000, currentNote.vibrato);
  }
};

const playTremolo = (n, replaySpeed, buffers, tuning, noteToPlay) => {
  const currentTime = audioContext.currentTime;

  _.times(n, (i) => {
    playNoteAtTime(noteToPlay, currentTime + (i * replaySpeed / (n * 1000)), replaySpeed / n, buffers, tuning);
  });
};

const playTremoloNote = (noteToPlay, replaySpeed, buffers, tuning) => {
  switch(noteToPlay.duration) {
    case 's':
      playTremolo(2, replaySpeed, buffers, tuning, noteToPlay);
      break;
    case 'e':
      playTremolo(4, replaySpeed, buffers, tuning, noteToPlay);
      break;
    case 'q':
      playTremolo(8, replaySpeed, buffers, tuning, noteToPlay);
      break;
    case 'h':
      playTremolo(16, replaySpeed, buffers, tuning, noteToPlay);
      break;
    case 'w':
      playTremolo(32, replaySpeed, buffers, tuning, noteToPlay);
      break;
    default:
      playTremolo(1, replaySpeed, buffers, tuning, noteToPlay);
      break;
  }
};

exports.playCurrentNote = (track, playingIndex, buffers) => {
  const { measures, tuning } = track;

  const measure = measures[playingIndex.measureIndex];
  const bpm = measure.bpm;
  let noteToPlay;
  if(measure.notes.length > 0) {
    noteToPlay = measure.notes[playingIndex.noteIndex];
  } else {
    noteToPlay = { duration: 'w', fret: ['rest'] };
  }

  const replaySpeed = exports.getReplaySpeedForNote(measure.notes, playingIndex.noteIndex, bpm);

  if(noteToPlay.fret[0] === 'rest') {
    playNoteAtTime('rest', audioContext.currentTime, replaySpeed, buffers, tuning);
  } else if(noteToPlay.tremolo) {
    playTremoloNote(noteToPlay, replaySpeed, buffers, tuning);
  } else {
    playNoteAtTime(noteToPlay, audioContext.currentTime, replaySpeed, buffers, tuning);
  }
};
