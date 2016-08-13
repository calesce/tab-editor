import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { findIndex } from 'lodash';

import { makeMapStateToProps } from '../../util/selectors';
import { makeTabMeasureSelector } from '../../util/measureSelectors';

import TabNote from './TabNote';
import Staff from './Staff';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Cursor from './Cursor';
import Bpm from './Bpm';
import RepeatSign from './RepeatSign';

import { setCursor } from '../../actions/cursor';

const measureIndexStyle = {
  fontSize: 9,
  fill: 'tomato'
};

class TabMeasure extends PureComponent {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick(noteIndex, stringIndex) {
    this.props.setCursor({
      noteIndex,
      stringIndex,
      measureIndex: this.props.measureIndex
    });
  }

  renderCursor() {
    const { cursor, stringCount, measure } = this.props;

    if(!cursor) {
      return null;
    }
    const { noteIndex, stringIndex } = cursor;
    const y = 95 - (13 * (stringIndex + (6 - stringCount)));

    let index = 0;
    let fret = 0;
    let x = 10;

    if(!measure.notes[noteIndex]) {
      if(measure.indexOfRow === 0) {
        x += 8;
      }
      if(measure.renderTimeSignature) {
        x += 30;
      }
    } else if(measure.notes.length > 0) {
      index = findIndex(measure.notes[noteIndex].string, (s) => s === stringIndex);
      fret = measure.notes[noteIndex].fret[index];
      x = measure.notes[noteIndex] ? measure.notes[noteIndex].x : 10;
    }

    return <Cursor x={x} y={y} fret={fret} />;
  }

  renderTabNote(note, measureIndex, noteIndex, displayOption) {
    const { playingNoteIndex, stringCount } = this.props;
    const stringOffset = (6 - stringCount);

    let color = 'black';
    if(playingNoteIndex === noteIndex) {
      color = '#f9423a';
    }

    const y = stringCount * 6.5 + 6; // 45 for 6 strings
    if(note.string[0] === 'rest') {
      return <Rest onClick={this.onClick} key={noteIndex} noteIndex={noteIndex} color={color} x={note.x} y={y} note={note} />;
    }

    return [0, 1, 2, 3, 4, 5].map((_, i) => {
      const stringIndex = findIndex(note.string, (index) => index === i);
      const string = stringIndex === -1 ? i : note.string[stringIndex];
      const fret = stringIndex === -1 ? undefined : note.fret[stringIndex];
      const y = 95 - (13 * (i + stringOffset));
      return (
        <g>
          <TabNote onClick={this.onClick} key={i} x={note.x} y={y} color={color}
            fret={fret} stringOffset={stringOffset} displayOption={displayOption} dotted={note.dotted}
            tremolo={note.tremolo} vibrato={note.vibrato} trill={note.trill} duration={note.duration}
            stringIndex={string} noteIndex={noteIndex}
          />
        </g>
      );
    });
  }

  render() {
    const {
      stringCount, measure, measureIndex, displayOption, y,
      playingNoteIndex, isValid, measureLength
    } = this.props;

    return (
      <svg y={y} style={{ height: (stringCount * 25), width: measure.width }}>
        <Staff measureWidth={measure.width} y={0} playingNoteIndex={playingNoteIndex}
          strings={stringCount} lastMeasure={measureIndex === measureLength - 1} isValid={isValid}
        />
        {
          measure.notes.map((note, noteIndex) => this.renderTabNote(note, measureIndex, noteIndex, displayOption))
        }
        <Bpm tab y={0} bpm={measure.bpm} renderBpm={measure.renderBpm} displayOption={displayOption} />
        { displayOption === 'tab' ? <text x={0} y={23} style={measureIndexStyle}>{measureIndex + 1}</text> : null }
        { measure.indexOfRow === 0 ? <Clef y={25} strings={stringCount} repeatBegin={measure.repeatBegin} tab /> : null }
        <TimeSignature yOffset={0} strings={stringCount} measure={measure} displayOption={displayOption} repeatBegin={measure.repeatBegin} />
        { this.renderCursor() }
        { measure.repeatEnd ? <RepeatSign measureWidth={measure.width} strings={stringCount} y={25} repeatEnd={measure.repeatEnd} />
        : null }
        { measure.repeatBegin ? <RepeatSign measureWidth={measure.width} strings={stringCount} y={25} repeatEnd={false} />
        : null }
      </svg>
    );
  }
}

export default connect(
  makeMapStateToProps(makeTabMeasureSelector),
  { setCursor }
)(TabMeasure);
