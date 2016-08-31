import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { findIndex } from 'lodash';

import { makeMapStateToProps } from '../../util/selectors';
import { makeTabMeasureSelector } from '../../util/measureSelectors';

import TabNote from './TabNote';
import ClickArea from './TabClickArea';
import Staff from './Staff';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Cursor from './Cursor';
import TempoMarker from './TempoMarker';
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
      measureIndex: this.props.measure.measureIndex
    });
  }

  renderCursor(cursor, measure, stringCount) {
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

    const color = playingNoteIndex === noteIndex ? '#f9423a' : 'black';
    const y = stringCount * 6.5 + 6; // 45 for 6 strings

    if(note.string[0] === 'rest') {
      return <Rest onClick={this.onClick} key={noteIndex} noteIndex={noteIndex}
        color={color} x={note.x} y={y} note={note}
      />;
    }

    return [0, 1, 2, 3, 4, 5].map((_, i) => {
      const stringIndex = findIndex(note.string, index => index === i);
      const fret = stringIndex === -1 ? undefined : note.fret[stringIndex];
      if(fret === undefined) {
        return null;
      }
      const string = stringIndex === -1 ? i : note.string[stringIndex];
      const y = 95 - (13 * (i + 6 - stringCount));
      return (
        <TabNote onClick={this.onClick} key={i} y={y} color={color} noteIndex={noteIndex}
          fret={fret} displayOption={displayOption} note={note} stringIndex={string}
        />
      );
    });
  }

  renderClickArea(note, noteIndex, stringCount) {
    return [0, 1, 2, 3, 4, 5].map((_, i) => {
      const stringIndex = findIndex(note.string, index => index === i);
      const string = stringIndex === -1 ? i : note.string[stringIndex];

      const y = 95 - (13 * (i + 6 - stringCount));
      return <ClickArea x={note.x} y={y} onClick={this.onClick} noteIndex={noteIndex} stringIndex={string} />;
    });
  }

  render() {
    const {
      stringCount, measure, displayOption, y,
      playingNoteIndex, isValid, measureLength, cursor
    } = this.props;

    return (
      <svg y={y} style={{ height: (stringCount * 25), width: measure.width }}>
        <Staff measureWidth={measure.width} y={0} playingNoteIndex={playingNoteIndex}
          strings={stringCount} lastMeasure={measure.measureIndex === measureLength - 1} isValid={isValid}
        />
        { measure.notes.map((note, i) => this.renderClickArea(note, i, stringCount)) }
        {
          measure.notes.map((note, noteIndex) => this.renderTabNote(note, measure.measureIndex, noteIndex, displayOption))
        }
        <TempoMarker tab y={0} tempo={measure.tempo} renderTempo={measure.renderTempo} displayOption={displayOption} />
        { displayOption === 'tab' ? <text x={0} y={23} style={measureIndexStyle}>{measure.measureIndex + 1}</text> : null }
        { measure.indexOfRow === 0 ? <Clef y={25} strings={stringCount} repeatBegin={measure.repeatBegin} tab /> : null }
        <TimeSignature yOffset={0} strings={stringCount} measure={measure} displayOption={displayOption} repeatBegin={measure.repeatBegin} />
        { this.renderCursor(cursor, measure, stringCount) }
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
