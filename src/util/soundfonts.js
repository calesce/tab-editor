import Soundfont from 'soundfont-player';
import audioContext from '../util/audioContext';

// Fix for Safari/Edge, which can't play .ogg files
if(!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) || !!navigator.userAgent.match(/Edge\/\d+/)) {
  Soundfont.nameToUrl = function(name) {
    return `https://cdn.rawgit.com/gleitz/midi-js-Soundfonts/master/FluidR3_GM/${name}-mp3.js`;
  };
}

let bufferCache = {};

export function loadSoundfonts(instruments) {
  const promises = instruments.map(instrument => {
    return loadSoundfont(instrument, bufferCache);
  });

  return Promise.all(promises)
    .then(instrumentBuffers => {
      instrumentBuffers.forEach((buffer, i) => {
        bufferCache[instruments[i]] = buffer;
      });
      return bufferCache;
    });
}

const loadSoundfont = (instrument, cache) => {
  if(cache[instrument]) {
    return new Promise(resolve => resolve(cache[instrument]));
  }
  return Soundfont.loadBuffers(audioContext, instrument);
};
