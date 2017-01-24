/*eslint-disable no-undef */

let audioContext;
try {
  audioContext = new AudioContext();
} catch (e) {
  audioContext = new webkitAudioContext();
}

export default audioContext;
