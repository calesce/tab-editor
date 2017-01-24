/* @flow */
import Soundfont from 'soundfont-player';
import audioContext from '../util/audioContext';

// Fix for Safari/Edge, which can't play .ogg files
let options = {};
if (
  !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) ||
    !!navigator.userAgent.match(/Edge\/\d+/)
) {
  options.nameToUrl = function(name: string): string {
    return `https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM/${name}-mp3.js`;
  };
}

let bufferCache = {};

export function loadSoundfonts(instruments: Array<string>): Promise<Object> {
  const promises = instruments.map(instrument => {
    return loadSoundfont(instrument, bufferCache);
  });

  return Promise.all(promises).then(instrumentObjects => {
    instrumentObjects.forEach((instrument, i) => {
      bufferCache[instruments[i]] = instrument.buffers;
    });
    return bufferCache;
  });
}

const loadSoundfont = (instrument: string, cache: Object): Promise<Object> => {
  if (cache[instrument]) {
    return new Promise(resolve => resolve(cache[instrument]));
  }
  return Soundfont.instrument(audioContext, instrument, options);
};
