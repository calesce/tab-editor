import React, { Component } from 'react';

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: null
    };
  }

  componentWillUpdate = (nextProps) => {
    if(nextProps.isPlaying && !this.state.timer) {
      this.startPlayback();
    } else if(nextProps.isPlaying) {
      this.loopThroughSong(this.state.timestamp);
    }
  }

  getSpeedFromBpm = (bpm) => {
    return 60000 / bpm;
  }

  getReplaySpeedForNote = (note, bpm) => {
    let noteLength = note.duration;

    let replaySpeed = this.getSpeedFromBpm(bpm);
    if(noteLength === 'h') {
      replaySpeed = replaySpeed * 2;
    } else if(noteLength === 'w') {
      replaySpeed = replaySpeed * 4;
    } else if(noteLength === 'e') {
      replaySpeed = replaySpeed / 2;
    } else if(noteLength === 's') {
      replaySpeed = replaySpeed / 4;
    }

    return replaySpeed;
  }

  loopThroughSong = (startTimestamp) => {
    let { currentPlayingNote, bpm, song } = this.props;
    let { measure, noteIndex } = currentPlayingNote;

    let currentTimestamp = Date.now();
    let replayDiff = currentTimestamp - startTimestamp;
    let replaySpeed = this.getReplaySpeedForNote(song[currentPlayingNote.measure].notes[noteIndex], bpm);

    if(replayDiff >= replaySpeed) {
      if(measure === song.length - 1 && noteIndex === song[measure].notes.length - 1) {
        this.handleStop();
      } else if(measure !== song.length - 1 && noteIndex === song[measure].notes.length - 1) {
        this.props.update({
          measure: measure + 1,
          noteIndex: 0
        });
        this.setState({
          timestamp: currentTimestamp
        });
      } else {
        this.props.update({
          measure,
          noteIndex: noteIndex + 1
        });
        this.setState({
          timestamp: currentTimestamp
        });
      }
    } else {
      this.setState({
        timestamp: currentTimestamp
      });
    }
  }

  playCurrentNote = () => {
    let noteToPlay = this.props.song[this.props.currentPlayingNote.measure].notes[this.props.currentPlayingNote.noteIndex];
    let replaySpeed = this.getReplaySpeedForNote(noteToPlay, this.props.bpm);

    if(noteToPlay.fret[0] === 'rest') {
      this.play(this.props.audioContext, this.props.audioContext.currentTime, 'rest', replaySpeed);
    } else {
      this.playNoteAtTime(noteToPlay, this.props.audioContext.currentTime, replaySpeed);
    }
  }

  playNoteAtTime = (currentNote, playTime, duration) => {
    for(let i = 0; i < currentNote.string.length; i++) {
      let pitch = currentNote.fret[i] + (5 * currentNote.string[i]);
      if(currentNote.string[i] >= 4) {
        pitch = pitch - 1;
      }

      this.play(this.props.audioContext, playTime, pitch, duration / 1000);
    }
  }

  play = (audioContext, startTime, pitch, duration) => {
    let endTime = startTime + duration;

    let oscillator = this.props.audioContext.createOscillator();
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
  }

  startPlayback = () => {
    let startTimestamp = Date.now();
    this.playCurrentNote();

    this.setState({
      timer: requestAnimationFrame(() => {
        this.loopThroughSong(startTimestamp);
      })
    });
  }

  render() {
    return null;
  }
}
