import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import { determineFlip } from '../../util/notationMath';

import MusicNote from './MusicNote';
import Bars from './Bars';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Bpm from './Bpm';
import RepeatSign from './RepeatSign';

const measureNumberStyle = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  cursor: 'default',
  fontSize: 9,
  fill: 'tomato'
};

class MusicMeasure extends Component {
  constructor() {
    super();

    this.renderBars = this.renderBars.bind(this);
    this.renderMusicNote = this.renderMusicNote.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  renderBars(x, y, measureWidth, strings) {
    const { playingNoteIndex, isValid, measureIndex, measureLength } = this.props;

    const lastMeasure = measureIndex === measureLength - 1;
    let color = '#999999';
    let strokeWidth = 0.1;
    if(playingNoteIndex !== undefined) {
      color = '#267754';
      strokeWidth = 1;
    } else if(!isValid) {
      color = 'red';
      strokeWidth = 1;
    }

    return <Bars measureWidth={measureWidth} color={color} y={y} spaceBetweenBars={13}
      strokeWidth={strokeWidth} strings={strings} lastMeasure={lastMeasure}
    />;
  }

  renderMusicNote(note, measureIndex, noteIndex, yTop) {
    if(note.string[0] === 'rest') {
      return <Rest key={noteIndex} color={note.color} x={note.x} y={note.y} note={note} />;
    }

    return note.fret.map((fret, i) => {
      const yToUse = note.notes[i].y;
      const flip = determineFlip(note, yToUse, yTop);

      return <MusicNote key={i} x={note.x} y={yToUse} color={note.color} duration={note.duration} dotted={note.dotted}
        sharp={note.notes[i].renderSharp} natural={note.notes[i].renderNatural} yTop={yTop} flip={flip}
        tremolo={note.tremolo} vibrato={note.vibrato} trill={note.trill} tuplet={note.tuplet} />;
    });
  }

  render() {
    const { measure, measureIndex, rowHeight, yTop, notesWithAccidentals } = this.props;

    return (
      <svg style={{ height: rowHeight, width: measure.width, overflow: 'visible' }}>
        { this.renderBars(0, yTop, measure.width, 5) }
        {
          notesWithAccidentals.map((note, noteIndex) => this.renderMusicNote(note, measureIndex, noteIndex, yTop))
        }
        { measure.indexOfRow === 0 ? <Clef y={yTop} strings={5} treble repeatBegin={measure.repeatBegin} /> : null }
        <TimeSignature yOffset={yTop} strings={5} measure={measure} repeatBegin={measure.repeatBegin} />
        { measure.renderBpm ? <Bpm y={yTop} bpm={measure.bpm} />  : null }
        <text x={0} y={23 + yTop} style={measureNumberStyle}>{measureIndex + 1}</text>
        { measure.repeatEnd ?
          <RepeatSign measureWidth={measure.width} strings={5} y={yTop + 25} repeatEnd={measure.repeatEnd} />
          : null }
        { measure.repeatBegin ? <RepeatSign measureWidth={measure.width} strings={5} y={yTop + 25} repeatEnd={false} />
          : null }
      </svg>
    );
  }
}

export default MusicMeasure;
