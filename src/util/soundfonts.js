import Soundfont from 'soundfont-player';
import audioContext from '../util/audioContext';

// Fix for Safari/Edge, which can't play .ogg files
let options = {};
if(!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) || !!navigator.userAgent.match(/Edge\/\d+/)) {
  options.nameToUrl = function(name: string): string {
    return `https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM/${name}-mp3.js`;
  };
}

export default class SoundfontLoader {
  constructor() {
    this.cache = {};
  }

  loadSoundfonts = async (instruments) => {
    const instrumentObjects = await Promise.all(
      instruments.map(instrument => {
        return this.loadSoundfont(instrument);
      })
    );

    instrumentObjects.forEach((instrument, i) => {
      this.cache[instruments[i]] = instrument.buffers || instrument;
    });
    return this.cache;
  }

  loadSoundfont = instrument => {
    if(this.cache[instrument]) {
      return new Promise(resolve => resolve(this.cache[instrument]));
    }
    return Soundfont.instrument(audioContext, instrument, options);
  }
}
