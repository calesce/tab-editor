import { getIndexOfNote } from './midiNotes';
import audioContext from './audioContext';
import { times } from 'lodash';
import {
  numberOfTremoloNotesForDuration,
  getReplaySpeedFromPercentage
} from './audioMath';

const playVibrato = (source, startTime, endTime) => {
  let freqGain = audioContext.createGain();
  let lfo = audioContext.createOscillator();
  freqGain.gain.value = 20;
  // range of vibrato
  freqGain.connect(source.detune);
  lfo.frequency.value = 4;
  // fast vibrato
  lfo.type = 'square';
  lfo.connect(freqGain);

  lfo.start(startTime);
  lfo.stop(endTime);
};

// NOTE slur:
// const halfwayBetween = startTime + (endTime - startTime) / 2;
// source.detune.setValueCurveAtTime(100.0, halfwayBetween, halfwayBetween);
const extendBuffer = buffer => {
  const newBuffer = audioContext.createBuffer(
    buffer.numberOfChannels,
    buffer.length + 0.75 * buffer.length,
    buffer.sampleRate
  );
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    const bufferChannel = buffer.getChannelData(i);
    const newChannel = newBuffer.getChannelData(i);

    const chunkLength = Math.round(buffer.length / 4);
    const startIndex = Math.round(buffer.length / 2) + chunkLength;

    const copiedChunk = bufferChannel.slice(
      startIndex,
      startIndex + chunkLength
    );

    newChannel.set(bufferChannel, 0);
    newChannel.set(copiedChunk, startIndex + chunkLength);
    newChannel.set(copiedChunk, startIndex + chunkLength + chunkLength);
    newChannel.set(copiedChunk, startIndex + 3 * chunkLength);
  }
  return newBuffer;
};

export function playWithBuffer(
  buffer,
  duration,
  startTime = audioContext.currentTime,
  vibrato
) {
  let endTime = startTime + duration;

  let source = audioContext.createBufferSource();

  let gainNode = audioContext.createGain();
  if (buffer.duration < duration) {
    source.buffer = extendBuffer(buffer);
    gainNode.gain.linearRampToValueAtTime(0.01, endTime + 0.015);
  } else {
    source.buffer = buffer;
    gainNode.gain.setTargetAtTime(0, endTime, 0.015); // remove clicking noise between notes
  }

  gainNode.connect(audioContext.destination);
  source.connect(gainNode);

  if (vibrato) {
    playVibrato(source, startTime, endTime);
  }

  source.start(startTime);
  source.stop(endTime + 0.016);
  return source;
}

const playNoteAtTime = (note, playTime, duration, buffers, tuning) => {
  if (note === 'rest') {
    return;
  }

  let lastBuffers = [];
  for (let i = 0; i < note.string.length; i++) {
    const openString = tuning[note.string[i]];
    const noteToPlay = getIndexOfNote(openString) + note.fret[i];

    const buffer = playWithBuffer(
      buffers[noteToPlay],
      duration / 1000,
      playTime,
      note.vibrato
    );
    lastBuffers.push(buffer);
  }
  return lastBuffers;
};

const playTremolo = (note, currentTime, replaySpeed, buffers, tuning) => {
  const n = numberOfTremoloNotesForDuration(note.duration);

  let lastBuffers = [];
  times(n, i => {
    lastBuffers = [
      ...lastBuffers,
      ...playNoteAtTime(
        note,
        currentTime + i * replaySpeed / (n * 1000),
        replaySpeed / n,
        buffers,
        tuning
      )
    ];
  });
  return lastBuffers;
};

const playTrill = (note, currentTime, replaySpeed, buffers, tuning) => {
  const n = numberOfTremoloNotesForDuration(note.duration);

  let lastBuffers = [];
  times(n, i => {
    const higherNote = { ...note, fret: note.fret.map(note => note + 1) };
    const noteToPlay = i % 2 === 0 ? note : higherNote;
    lastBuffers = [
      ...lastBuffers,
      ...playNoteAtTime(
        noteToPlay,
        currentTime + i * replaySpeed / (n * 1000),
        replaySpeed / n,
        buffers,
        tuning
      )
    ];
  });
  return lastBuffers;
};

export function playCurrentNoteAtTime(note, time, buffers) {
  const replaySpeed = getReplaySpeedFromPercentage(
    note.percentage,
    note.timeSignature,
    note.tempo
  );

  if (note.metronome) {
    return [playWithBuffer(buffers[60], replaySpeed / 1000, time)];
  } else if (note.tremolo) {
    return playTremolo(
      note,
      time || audioContext.currentTime,
      replaySpeed,
      buffers,
      note.tuning
    );
  } else if (note.trill) {
    return playTrill(
      note,
      time || audioContext.currentTime,
      replaySpeed,
      buffers,
      note.tuning
    );
  } else if (note.fret[0] !== 'rest') {
    return [
      playNoteAtTime(
        note,
        time || audioContext.currentTime,
        replaySpeed,
        buffers,
        note.tuning
      )
    ];
  }
}
