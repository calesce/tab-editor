import React, { Component } from 'react';
import { findIndex } from 'lodash';

import { calcXForNote } from '../../util';
import { getIndexOfNote, getStaffPositionOfNote, midis } from '../../util/midiNotes';

import MusicNote from './MusicNote';
import Bars from './Bars';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Bpm from './Bpm';
import Repeat from './Repeat';

class MusicMeasure extends Component {
  renderTimeSignature = (measureIndex, measure, strings, yOffset) => {
    const x = this.props.measure.indexOfRow === 0 ? 36 : 20;
    const y = (strings * 6 - 6) + yOffset; // y of top of time signature
    const { renderTimeSignature, timeSignature } = measure;

    return renderTimeSignature ?
      <TimeSignature x={x} y={y} strings={strings} numerator={timeSignature[0]} denominator={timeSignature.slice(2, 4)} /> :
      null;
  };

  renderBars = (x, y, measureWidth, tuning) => {
    const { playingIndex, isValid, measureIndex, measureLength } = this.props;

    const lastMeasure = measureIndex === measureLength - 1;
    let color = '#999999';
    let strokeWidth = 0.1;
    if(playingIndex) {
      if(measureIndex === playingIndex.measureIndex) {
        color = '#267754';
        strokeWidth = 1;
      }
    } else if(!isValid) {
      color = 'red';
      strokeWidth = 1;
    }

    return <Bars measureWidth={measureWidth} color={color} y={y}
      strokeWidth={strokeWidth} strings={tuning} lastMeasure={lastMeasure}
    />;
  };

  renderMusicNote = (note, measureIndex, noteIndex, yOffset) => {
    const x = calcXForNote(this.props.measure, noteIndex);
    const { playingIndex, tuning } = this.props;

    let color = 'black';
    if(playingIndex) {
      if(playingIndex.measureIndex === measureIndex && playingIndex.noteIndex === noteIndex && playingIndex) {
        color = '#f9423a';
      }
    }

    const y = 5 * 6.5 + 6 + yOffset; // 45 for 6 strings
    if(note.string[0] === 'rest') {
      return <Rest key={noteIndex} color={color} x={x} y={y} note={note} />;
    }

    return tuning.map((_, i) => {
      const stringIndex = findIndex(note.string, (index) => index === i);
      const fret = stringIndex === -1 ? undefined : note.fret[stringIndex];
      if(fret === undefined) {
        return null;
      }

      const midiIndex = getIndexOfNote(tuning[i]) + fret;
      const midiString = midis[midiIndex];
      const staffPosition = getStaffPositionOfNote(midiString.replace('#', ''));
      const sharp = midiString.charAt(1) === '#';

      // ok this works ok for quarter notes, now we need all types of notes to be able to use the
      // same y position
      // also render accidentals pls
      const y = yOffset + 249 - (6.5 * staffPosition);

      return <MusicNote key={i} x={x} y={y} color={color} fret={fret} note={note} sharp={sharp} />;
    });
  };

  render() {
    const { measure, measureIndex, measureHeight, y } = this.props;

    return (
      <svg style={{ height: measureHeight, width: measure.width, overflow: 'visible' }}>
        { this.renderBars(0, y, measure.width, [0, 1, 2, 3, 4]) }
        {
          measure.notes.map((note, noteIndex) => this.renderMusicNote(note, measureIndex, noteIndex, y))
        }
        { measure.indexOfRow === 0 ? <Clef y={y} strings={5} treble /> : null }
        { this.renderTimeSignature(measureIndex, measure, 5, y) }
        { measure.showBpm ? <Bpm y={y} bpm={measure.bpm} />  : null }
        <text x={0} y={23 + y} style={{ fontSize: 9, fill: 'tomato' }}>{measureIndex + 1}</text>
        { measure.repeatEnd ? <Repeat measureWidth={measure.width} strings={5} y={y} /> : null }
      </svg>
    );
  }
}

export default MusicMeasure;
