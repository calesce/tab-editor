import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findIndex } from 'lodash';
import shallowCompare from 'react-addons-shallow-compare';

import { makeMapStateToProps } from '../../util/selectors';
import { makeTabMeasureSelector } from '../../util/measureSelectors';

import TabNote from './TabNote';
import Bars from './Bars';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Cursor from './Cursor';
import Bpm from './Bpm';
import Repeat from './Repeat';

import { setCursor } from '../../actions/cursor';

const measureIndexStyle = {
  fontSize: 9,
  fill: 'tomato'
};

class TabMeasure extends Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
    this.renderCursor = this.renderCursor.bind(this);
    this.renderBars = this.renderBars.bind(this);
    this.renderTabNote = this.renderTabNote.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
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

  renderBars(x, y, measureWidth, stringCount) {
    const { playingNoteIndex, isValid, measureIndex, measureLength } = this.props;

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
      strokeWidth={strokeWidth} strings={stringCount} lastMeasure={measureIndex === measureLength - 1}
    />;
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
    const { stringCount, measure, measureIndex, displayOption, y } = this.props;

    return (
      <svg y={y} style={{ height: (stringCount * 25), width: measure.width }}>
        { this.renderBars(0, 0, measure.width, stringCount) }
        {
          measure.notes.map((note, noteIndex) => this.renderTabNote(note, measureIndex, noteIndex, displayOption))
        }
        <Bpm tab y={0} bpm={measure.bpm} showBpm={measure.showBpm} displayOption={displayOption} />
        { displayOption === 'tab' ? <text x={0} y={23} style={measureIndexStyle}>{measureIndex + 1}</text> : null }
        { measure.indexOfRow === 0 ? <Clef y={25} strings={stringCount} tab /> : null }
        <TimeSignature yOffset={0} strings={stringCount} measure={measure} displayOption={displayOption} />
        { this.renderCursor() }
        { measure.repeatEnd ? <Repeat measureWidth={measure.width} strings={stringCount} y={0} /> : null }
      </svg>
    );
  }
}

export default connect(
  makeMapStateToProps(makeTabMeasureSelector),
  { setCursor }
)(TabMeasure);
