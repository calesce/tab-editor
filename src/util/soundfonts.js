import Soundfont from 'soundfont-player';
import audioContext from '../util/audioContext';

// Fix for Safari/Edge, which can't play .ogg files
if(!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) || !!navigator.userAgent.match(/Edge\/\d+/)) {
  Soundfont.nameToUrl = function(name) {
    return `https://cdn.rawgit.com/gleitz/midi-js-Soundfonts/master/FluidR3_GM/${name}-mp3.js`;
  };
}

let bufferCache = {};

export function loadSoundfont(instrument, cb) {
  Soundfont.loadBuffers(audioContext, instrument).then((buffers) => {
    bufferCache[instrument] = buffers;
    cb(bufferCache);
  });
}
