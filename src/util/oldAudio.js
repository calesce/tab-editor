let requestId;
let noteTime;
let currentPlayingIndex = {
  measure: 0,
  noteIndex: 0
};

exports.handlePlay = () => {
  noteTime = 0.0;

  this.setState({
    isPlaying: true,
    startTime: this.state.audioContext.currentTime + .005,
  }, () => {
    this.changeNotes(0, 0);
    this.schedule();
  });
};

exports.schedule = () => {
  let currentTime = this.state.audioContext.currentTime - this.state.startTime;

  while(noteTime < currentTime + 0.200) {
    let contextPlayTime = noteTime + this.state.startTime;
    let { measure, noteIndex } = currentPlayingIndex;

    if(measure === 'NO') {
      return;
    }

    let noteToPlay = song[measure].notes[noteIndex];

    this.playNoteAtTime(noteToPlay, contextPlayTime);
    currentPlayingIndex = this.advanceNote(measure, noteIndex);
  }
  requestId = requestAnimationFrame(this.schedule);
};

exports.advanceNote = (measure, noteIndex) => {
  let tempo = 60.0;
  let secondsPerBeat = 60.0 / tempo;
  noteTime = noteTime + (0.5 * secondsPerBeat);

  if(measure === song.length - 1 && noteIndex === song[measure].notes.length - 1) {
    return {
      measure: 'NO',
      noteIndex: 0
    };
  } else if(measure !== song.length - 1 && noteIndex === song[measure].notes.length - 1) {
    return {
      measure: measure + 1,
      noteIndex: 0
    };
  } else {
    return {
      measure: measure,
      noteIndex: noteIndex + 1
    };
  }
};

exports.handleStop = () => {
  cancelAnimationFrame(requestId);
};
