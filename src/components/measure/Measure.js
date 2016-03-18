import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { findIndex } from 'lodash';

import * as Actions from '../../actions/cursor';

import TabNote from './TabNote';
import MusicNote from './MusicNote';
import Bars from './Bars';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Cursor from './Cursor';
import Bpm from './Bpm';
import Repeat from './Repeat';
import shallowEqual from 'react-pure-render/shallowEqual';
import { finalMeasureSelector } from '../../util/selectors';
import { midis, getIndexOfNote } from '../../util/midiNotes';

class Measure extends Component {
  shouldComponentUpdate(nextProps) {
    const playingIndexEqual = !shallowEqual(this.props.playingIndex, nextProps.playingIndex);
    if(playingIndexEqual) {
      return true;
    }
    const cursorEqual = !shallowEqual(this.props.cursor, nextProps.cursor);
    if(cursorEqual) {
      return true;
    }
    const tuningEqual = !shallowEqual(this.props.tuning, nextProps.tuning);
    if(tuningEqual) {
      return true;
    }
    const measureShallowEqual = !shallowEqual(this.props.measure, nextProps.measure);

    for(let i = 0; i < this.props.measure.notes.length; i++) {
      const oldNote = this.props.measure.notes[i];
      const newNote = nextProps.measure.notes[i];

      if(!newNote) {
        return true;
      }
      if(oldNote.duration !== newNote.duration) {
        return true;
      }
      if(!shallowEqual(oldNote.string, newNote.string)) {
        return true;
      }
      if(!shallowEqual(oldNote.fret, newNote.fret)) {
        return true;
      }
    }

    if(measureShallowEqual) {
      return true;
    }
    return false;
  }

  calcXForNote = (noteIndex) => {
    let x = 0 + (noteIndex * 53 + 33);
    if(this.props.measure.indexOfRow === 0) {
      x += 8;
    }
    if(this.props.measure.renderTimeSignature) {
      x += 30;
    }
    if(this.props.measure.notes.length === 0 && this.props.measure.indexOfRow !== 0) {
      x -= this.props.measure.renderTimeSignature ? 0 : 25;
    }
    return x;
  };

  onClick = (noteIndex, stringIndex) => {
    this.props.actions.setCursor({
      noteIndex,
      stringIndex,
      measureIndex: this.props.measureIndex
    });
  };

  renderBars = (x, measureWidth, tuning) => {
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

    return <Bars measureWidth={measureWidth} color={color}
      strokeWidth={strokeWidth} strings={tuning} lastMeasure={lastMeasure}
    />;
  };

  renderCursor = () => {
    if(!this.props.cursor) {
      return null;
    }
    const { noteIndex, stringIndex } = this.props.cursor;
    const strings = this.props.tuning.length;
    const stringOffset = (6 - strings);

    const x = this.calcXForNote(noteIndex);
    const y = 95 - (13 * (stringIndex + stringOffset));

    let index = 0;
    let fret = 0;

    if(this.props.measure.notes.length > 0) {
      index = findIndex(this.props.measure.notes[noteIndex].string, (s) => s === stringIndex);
      fret = this.props.measure.notes[noteIndex].fret[index];
    }

    return <Cursor x={x} y={y} fret={fret} />;
  };

  renderTabNote = (note, measureIndex, noteIndex) => {
    const x = this.calcXForNote(noteIndex);
    const { playingIndex, tuning } = this.props;
    const strings = this.props.tuning.length;
    const stringOffset = (6 - strings);

    let color = 'black';
    if(playingIndex) {
      if(playingIndex.measureIndex === measureIndex && playingIndex.noteIndex === noteIndex && playingIndex) {
        color = '#f9423a';
      }
    }

    const y = tuning.length * 6.5 + 6; // 45 for 6 strings
    if(note.string[0] === 'rest') {
      return <Rest onClick={this.onClick.bind(this, noteIndex, 0)} key={noteIndex} color={color} x={x} y={y} note={note} />;
    }

    return tuning.map((_, i) => {
      const stringIndex = findIndex(note.string, (index) => index === i);
      const string = stringIndex === -1 ? i : note.string[stringIndex];
      const fret = stringIndex === -1 ? undefined : note.fret[stringIndex];
      const y = 95 - (13 * (i + stringOffset));
      return (
        <g>
          <TabNote onClick={this.onClick.bind(this, noteIndex, string)}
            key={i} x={x} y={y} color={color} fret={fret} note={note} stringOffset={stringOffset}
          />
        </g>
      );
    });
  };

  renderMusicNote = (note, measureIndex, noteIndex) => {
    const x = this.calcXForNote(noteIndex);
    const { playingIndex, tuning } = this.props;

    let color = 'black';
    if(playingIndex) {
      if(playingIndex.measureIndex === measureIndex && playingIndex.noteIndex === noteIndex && playingIndex) {
        color = '#f9423a';
      }
    }

    const y = 5 * 6.5 + 6; // 45 for 6 strings
    if(note.string[0] === 'rest') {
      return <Rest onClick={this.onClick.bind(this, noteIndex, 0)} key={noteIndex} color={color} x={x} y={y} note={note} />;
    }

    return tuning.map((_, i) => {
      const stringIndex = findIndex(note.string, (index) => index === i);
      const fret = stringIndex === -1 ? undefined : note.fret[stringIndex];

      const midiIndex = getIndexOfNote(tuning[i]) + fret;

      // lol this is terrible, I'll figure out something better
      const y = 248 - (3.6 * midiIndex);

      return fret !== undefined ? (
        <g>
          <MusicNote key={i} x={x} y={y} color={color} fret={fret} note={note} />
        </g>
      ) : null;
    });
  };

  renderTimeSignature = (measureIndex, measure, strings) => {
    const x = this.props.measure.indexOfRow === 0 ? 36 : 20;
    const y = strings * 6 - 6; // y of top of time signature
    const { renderTimeSignature, timeSignature } = measure;

    return renderTimeSignature ?
      <TimeSignature x={x} y={y} strings={strings} numerator={timeSignature[0]} denominator={timeSignature.slice(2, 4)} /> :
      null;
  };

  renderRepeat = (measure) => {
    if(!measure.repeatEnd) {
      return null;
    }

    const strings = this.props.tuning.length;
    const { width } = measure;

    return <Repeat measureWidth={width} strings={strings} />;
  };

  renderBpm = (measure) => {
    return measure.showBpm ? <Bpm bpm={measure.bpm} /> : null;
  };

  renderMeasureNumber = (measureIndex) => {
    return <text x={0} y={23} style={{ fontSize: 9, fill: 'tomato' }}>{measureIndex + 1}</text>;
  };

  renderTabMeasure = (measureIndex, measure, x) => {
    return (
      <g>
        { this.renderBars(x, measure.width, this.props.tuning) }
        {
          measure.notes.map((note, noteIndex) => this.renderTabNote(note, measureIndex, noteIndex, x))
        }
      </g>
    );
  };

  renderMeasure = (measureIndex, measure, x) => {
    return (
      <g>
        { this.renderBars(x, measure.width, [0, 1, 2, 3, 4]) }
        {
          measure.notes.map((note, noteIndex) => this.renderMusicNote(note, measureIndex, noteIndex, x))
        }
      </g>
    );
  };

  render() {
    const { measure, measureIndex, tuning } = this.props;

    return (
      <div style={{ height: tuning.length * 48, width: measure.width}}>
        <svg style={{ height: (tuning.length * 20), width: measure.width, paddingTop: 15 }}>
          { this.renderMeasure(measureIndex, measure, 0) }
          { measure.indexOfRow === 0 ? <Clef y={25} strings={tuning.length} /> : null }
          { this.renderTimeSignature(measureIndex, measure, 5) }
          { this.renderBpm(measure) }
          { this.renderRepeat(measure) }
        </svg>
        <svg style={{ height: (tuning.length * 25), width: measure.width }}>
          { this.renderTabMeasure(measureIndex, measure, 0) }
          { measure.indexOfRow === 0 ? <Clef y={25} strings={tuning.length} tab /> : null }
          { this.renderTimeSignature(measureIndex, measure, tuning.length) }
          { this.renderCursor() }
          { this.renderMeasureNumber(measureIndex) }
          { this.renderRepeat(measure) }
        </svg>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(finalMeasureSelector, mapDispatchToProps)(Measure);
