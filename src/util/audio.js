import { getIndexOfNote } from './midiNotes';
import audioContext from './audioContext';
import { times } from 'lodash';
import { numberOfTremoloNotesForDuration, getReplaySpeedFromPercentage } from './audioMath';

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

export function playWithBuffer(buffer, duration, startTime = audioContext.currentTime, vibrato) {
  let endTime = startTime + duration;

  let source = audioContext.createBufferSource();
  source.buffer = buffer;
  let gainNode = audioContext.createGain();
  gainNode.gain.setTargetAtTime(0, endTime, 0.015); // remove clicking noise between notes
  gainNode.connect(audioContext.destination);
  source.connect(gainNode);

  if(vibrato) {
    playVibrato(source, startTime, endTime);
  }

  source.start(startTime);
  source.stop(endTime + 0.016);
}

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

const playNoteAtTime = (note, playTime, duration, buffers, tuning) => {
  if(note === 'rest') {
    return play(playTime, 'rest', duration / 1000);
  }

  for(let i = 0; i < note.string.length; i++) {
    const openString = tuning[note.string[i]];
    const noteToPlay = getIndexOfNote(openString) + note.fret[i];

    playWithBuffer(buffers[noteToPlay], duration / 1000, playTime, note.vibrato);
  }
};

const playTremolo = (note, currentTime, replaySpeed, buffers, tuning) => {
  const n = numberOfTremoloNotesForDuration(note.duration);

  times(n, i => {
    playNoteAtTime(note, currentTime + (i * replaySpeed / (n * 1000)), replaySpeed / n, buffers, tuning);
  });
};

const playTrill = (note, currentTime, replaySpeed, buffers, tuning) => {
  const n = numberOfTremoloNotesForDuration(note.duration);

  times(n, i => {
    const higherNote = {
      ...note,
      fret: note.fret.map((note) => note + 1)
    };
    const noteToPlay = i % 2 === 0 ? note : higherNote;
    playNoteAtTime(noteToPlay, currentTime + (i * replaySpeed / (n * 1000)), replaySpeed / n, buffers, tuning);
  });
};

export function playCurrentNoteAtTime(note, time, buffers) {
  const replaySpeed = getReplaySpeedFromPercentage(note.percentage, note.timeSignature, note.bpm);

  if(note.metronome) {
    playWithBuffer(buffers[60], replaySpeed / 1000, time);
  } else if(note.fret[0] === 'rest') {
    playNoteAtTime('rest', time || audioContext.currentTime, replaySpeed, buffers, note.tuning);
  } else if(note.tremolo) {
    playTremolo(note,  time || audioContext.currentTime, replaySpeed, buffers, note.tuning);
  } else if(note.trill) {
    playTrill(note, time || audioContext.currentTime, replaySpeed, buffers, note.tuning);
  } else {
    playNoteAtTime(note, time || audioContext.currentTime, replaySpeed, buffers, note.tuning);
  }
}
