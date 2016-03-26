import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { findIndex, range } from 'lodash';
import { calcXForNote } from '../../util';

import TabNote from './TabNote';
import Bars from './Bars';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Cursor from './Cursor';
import Bpm from './Bpm';
import Repeat from './Repeat';

import { setCursor } from '../../actions/cursor';

class TabMeasure extends Component {
  onClick = (noteIndex, stringIndex) => {
    this.props.actions.setCursor({
      noteIndex,
      stringIndex,
      measureIndex: this.props.measureIndex
    });
  };

  renderCursor = () => {
    if(!this.props.cursor) {
      return null;
    }
    const { noteIndex, stringIndex } = this.props.cursor;
    const strings = this.props.stringCount;
    const stringOffset = (6 - strings);

    const x = calcXForNote(this.props.measure, noteIndex);
    const y = 95 - (13 * (stringIndex + stringOffset));

    let index = 0;
    let fret = 0;

    if(this.props.measure.notes.length > 0) {
      index = findIndex(this.props.measure.notes[noteIndex].string, (s) => s === stringIndex);
      fret = this.props.measure.notes[noteIndex].fret[index];
    }

    return <Cursor x={x} y={y} fret={fret} />;
  };

  renderTimeSignature = (measureIndex, measure, strings, yOffset, displayOption) => {
    const x = this.props.measure.indexOfRow === 0 ? 36 : 20;
    const y = (strings * 6 - 6) + yOffset; // y of top of time signature
    const { renderTimeSignature, timeSignature } = measure;

    return renderTimeSignature && displayOption === 'tab' ?
      <TimeSignature x={x} y={y} strings={strings} numerator={timeSignature[0]} denominator={timeSignature.slice(2, 4)} /> :
      null;
  };

  renderBars = (x, y, measureWidth, stringCount) => {
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
      strokeWidth={strokeWidth} strings={stringCount} lastMeasure={lastMeasure}
    />;
  };

  renderTabNote = (note, measureIndex, noteIndex, displayOption) => {
    const x = calcXForNote(this.props.measure, noteIndex);
    const { playingIndex, stringCount } = this.props;
    const stringOffset = (6 - stringCount);

    let color = 'black';
    if(playingIndex) {
      if(playingIndex.measureIndex === measureIndex && playingIndex.noteIndex === noteIndex && playingIndex) {
        color = '#f9423a';
      }
    }

    const y = stringCount * 6.5 + 6; // 45 for 6 strings
    if(note.string[0] === 'rest') {
      return <Rest onClick={this.onClick.bind(this, noteIndex, 0)} key={noteIndex} color={color} x={x} y={y} note={note} />;
    }

    return [0, 1, 2, 3, 4, 5].map((_, i) => {
      const stringIndex = findIndex(note.string, (index) => index === i);
      const string = stringIndex === -1 ? i : note.string[stringIndex];
      const fret = stringIndex === -1 ? undefined : note.fret[stringIndex];
      const y = 95 - (13 * (i + stringOffset));
      return (
        <g>
          <TabNote onClick={this.onClick.bind(this, noteIndex, string)}
            key={i} x={x} y={y} color={color} fret={fret} note={note} stringOffset={stringOffset} displayOption={displayOption}
          />
        </g>
      );
    });
  };

  render() {
    const { stringCount, measure, measureIndex, displayOption } = this.props;

    return (
      <svg style={{ height: (stringCount * 25), width: measure.width }}>
        { this.renderBars(0, 0, measure.width, range(stringCount)) }
        {
          measure.notes.map((note, noteIndex) => this.renderTabNote(note, measureIndex, noteIndex, displayOption))
        }
        { (measure.showBpm && displayOption === 'tab') ? <Bpm y={0} bpm={measure.bpm} />  : null }
        { displayOption === 'tab' ? <text x={0} y={23} style={{ fontSize: 9, fill: 'tomato' }}>{measureIndex + 1}</text> : null }
        { measure.indexOfRow === 0 ? <Clef y={25} strings={stringCount} tab /> : null }
        { this.renderTimeSignature(measureIndex, measure, stringCount, 0, displayOption) }
        { this.renderCursor() }
        { measure.repeatEnd ? <Repeat measureWidth={measure.width} strings={stringCount} y={0} /> : null }
      </svg>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCursor: bindActionCreators(setCursor, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(TabMeasure);
