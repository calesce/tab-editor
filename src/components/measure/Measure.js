import React, { Component } from 'react';

import TabNote from './TabNote';
import Bars from './Bars';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Cursor from './Cursor';
import Bpm from './Bpm';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Measure extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  calcMeasureValidity = (measure) => {
    const timeSig = parseInt(measure.timeSignature[0]) / parseInt(measure.timeSignature.slice(2, 4));
    const notesTotal = measure.notes.reduce((total, note) => {
      let duration;
      switch(note.duration) {
        case 'q':
          duration = 0.25;
          break;
        case 'e':
          duration = 0.125;
          break;
        case 's':
          duration = 0.0625;
          break;
        case 'h':
         duration = 0.5;
         break;
        default:
         duration = 1.0;
      }

      if(note.dotted) {
        duration *= 1.5;
      }

      return total + duration;
    }, 0);

    return timeSig === notesTotal;
  }

  calcXForNote = (noteIndex) => {
    let x = 0 + (noteIndex * 53 + 33);
    if(this.props.indexOfRow === 0) {
      x += 8;
    }
    if(this.props.measure.renderTimeSignature) {
      x += 30;
    }
    if(this.props.measure.notes.length === 0 && this.props.indexOfRow !== 0) {
      x -= this.props.measure.renderTimeSignature ? 0 : 25;
    }
    return x;
  }

  onClick = (noteIndex, stringIndex) => {
    this.props.onClick({
      noteIndex,
      stringIndex,
      measureIndex: this.props.totalMeasureIndex
    });
  }

  renderBars = (x, measureWidth, measureIndex) => {
    const { currentPlayingNote, measure } = this.props;
    const isValid = this.calcMeasureValidity(measure);

    let color = '#999999';
    let strokeWidth = 0.1;
    if(currentPlayingNote) {
      if(measureIndex === currentPlayingNote.measure) {
        color = '#267754';
        strokeWidth = 1;
      }
    } else if(!isValid) {
      color = 'red';
      strokeWidth = 1;
    }

    return <Bars measureWidth={measureWidth} color={color} strokeWidth={strokeWidth} />;
  }

  renderCursor = () => {
    const { noteIndex, stringIndex, measureIndex } = this.props.currentEditingIndex;
    if(this.props.totalMeasureIndex === measureIndex && !this.props.currentPlayingNote) {
      const x = this.calcXForNote(noteIndex);
      const y = 95 - (13 * stringIndex);

      let index = 0;
      let fret = 0;

      if(this.props.measure.notes.length > 0) {
        index = _.findIndex(this.props.measure.notes[noteIndex].string, (s) => s === stringIndex);
        fret = this.props.measure.notes[noteIndex].fret[index];
      }

      return <Cursor x={x} y={y} fret={fret} />;
    }

    return null;
  }

  renderNote = (note, measureIndex, noteIndex) => {
    const x = this.calcXForNote(noteIndex);
    const { currentPlayingNote } = this.props;

    let color = 'black';
    if(currentPlayingNote) {
      if(currentPlayingNote.measure === measureIndex && currentPlayingNote.noteIndex === noteIndex && currentPlayingNote) {
        color = '#f9423a';
      }
    }

    if(note.string[0] === 'rest') {
      return <Rest onClick={this.onClick.bind(this, noteIndex, 0)} key={noteIndex} color={color} x={x} y={0} note={note} />;
    }

    return note.string.map((string, i) => {
      const y = 95 - (13 * string);
      return (
        <g>
          <TabNote onClick={this.onClick.bind(this, noteIndex, string)} key={i} duration={note.duration} x={x} y={y} color={color}
            fret={note.fret[i]} dotted={note.dotted} tremelo={note.tremelo}
          />
        </g>
      );
    });
  }

  renderTimeSignature = (totalMeasureIndex, measure) => {
    const x = this.props.indexOfRow === 0 ? 36 : 20;
    const { renderTimeSignature, timeSignature } = measure;

    return renderTimeSignature ? <TimeSignature x={x} numerator={timeSignature[0]} denominator={timeSignature.slice(2, 4)} /> : null;
  }

  renderBpm = (measure) => {
    return measure.showBpm ? <Bpm bpm={measure.bpm} /> : null;
  }

  renderMeasureNumber = (totalMeasureIndex) => {
    return <text x={0} y={23} style={{ fontSize: 9, fill: 'tomato' }}>{totalMeasureIndex + 1}</text>;
  }

  renderMeasure = (measureIndex, measure, x) => {
    return (
      <g>
        { this.renderBars(x, measure.width, measureIndex) }
        {
          measure.notes.map((note, noteIndex) => this.renderNote(note, measureIndex, noteIndex, x))
        }
      </g>
    );
  }

  render() {
    const { measure, totalMeasureIndex, indexOfRow } = this.props;
    return (
      <svg style={{ height: 130, width: measure.width }}>
        { this.renderMeasure(totalMeasureIndex, measure, 0) }
        { indexOfRow === 0 ? <Clef /> : null }
        { this.renderTimeSignature(totalMeasureIndex, measure) }
        { this.renderCursor() }
        { this.renderBpm(measure) }
        { this.renderMeasureNumber(totalMeasureIndex) }
      </svg>
    );
  }
}
