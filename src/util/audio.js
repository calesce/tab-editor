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

const playNoteAtTime = (currentNote, playTime, duration, buffers, tuning) => {
  if(currentNote === 'rest') {
    return play(playTime, 'rest', duration / 1000);
  }

  for(let i = 0; i < currentNote.string.length; i++) {
    const openString = tuning[currentNote.string[i]];
    const noteToPlay = getIndexOfNote(openString) + currentNote.fret[i];

    playWithBuffer(buffers[noteToPlay], duration / 1000, playTime, currentNote.vibrato);
  }
};

const playTremolo = (replaySpeed, buffers, tuning, noteToPlay) => {
  const currentTime = audioContext.currentTime;
  const n = numberOfTremoloNotesForDuration(noteToPlay.duration);

  times(n, (i) => {
    playNoteAtTime(noteToPlay, currentTime + (i * replaySpeed / (n * 1000)), replaySpeed / n, buffers, tuning);
  });
};

const playTrill = (replaySpeed, buffers, tuning, noteToPlay) => {
  const currentTime = audioContext.currentTime;
  const n = numberOfTremoloNotesForDuration(noteToPlay.duration);

  times(n, (i) => {
    if(i % 2 === 0) {
      playNoteAtTime(noteToPlay, currentTime + (i * replaySpeed / (n * 1000)), replaySpeed / n, buffers, tuning);
    } else {
      const nextNote = Object.assign({}, noteToPlay, { fret: noteToPlay.fret.map((note) => note + 1) });
      playNoteAtTime(nextNote, currentTime + (i * replaySpeed / (n * 1000)), replaySpeed / n, buffers, tuning);
    }
  });
};

export function playCurrentNoteAtTime(note, time, buffers) {
  const replaySpeed = getReplaySpeedFromPercentage(note.percentage, note.timeSignature, note.bpm);

  if(note.fret[0] === 'rest') {
    playNoteAtTime('rest', time || audioContext.currentTime, replaySpeed, buffers, note.tuning);
  } else if(note.tremolo) {
    playTremolo(replaySpeed, buffers, note.tuning, note);
  } else if(note.trill) {
    playTrill(replaySpeed, buffers, note.tuning, note);
  } else {
    playNoteAtTime(note, time || audioContext.currentTime, replaySpeed, buffers, note.tuning);
  }
}
