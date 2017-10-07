/* @flow */
import Soundfont from 'soundfont-player';
import audioContext from '../util/audioContext';
import { uniq } from 'lodash';

// Fix for Safari/Edge, which can't play .ogg files
let options = {};
if (
  !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/) ||
  !!navigator.userAgent.match(/Edge\/\d+/)
) {
  options.nameToUrl = function(name: string): string {
    return `https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM/${name}-mp3.js`;
  };
}

let bufferCache = {};

export function loadSoundfonts(instruments: Array<string>): Promise<Object> {
  const promises = uniq(instruments).map(instrument => {
    return loadSoundfont(instrument, bufferCache);
  });

  return Promise.all(promises).then(instrumentObjects => {
    instrumentObjects.forEach(instrumentObj => {
      bufferCache[instrumentObj.instrument] = instrumentObj.buffers;
    });
    return bufferCache;
  });
}

const loadSoundfont = (instrument: string, cache: Object): Promise<Object> => {
  if (cache[instrument]) {
    return new Promise(resolve =>
      resolve({ instrument, buffers: cache[instrument] })
    );
  }
  return Soundfont.instrument(audioContext, instrument, options)
    .then(soundfont => ({ instrument, buffers: soundfont.buffers }))
    .catch(err => {
      throw err;
    });
};
