let audioContext;
try {
  audioContext = new AudioContext();
} catch(e) {
  audioContext = new webkitAudioContext();
}

export default audioContext;
