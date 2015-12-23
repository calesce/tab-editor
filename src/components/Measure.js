import React, { Component } from 'react';

import TabNote from './TabNote';
import Bars from './Bars';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Cursor from './Cursor';

export default class Measure extends Component {
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

  calcXForNote = (xOfMeasure, noteIndex, measureIndex, timeSignature) => {
    let x = xOfMeasure + (noteIndex * 55 + 39);
    if(measureIndex === 0) {
      x += 15;
    }
    if(this.props.measure.renderTimeSignature) {
      x += 20;
    }
    if(this.props.measure.notes.length === 0 && measureIndex !== 0 && !this.props.measure.timeSignature) {
      x -= 25;
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
    const { currentPlayingNote, isPlaying, measure } = this.props;
    const isValid = this.calcMeasureValidity(measure);

    let color, strokeWidth;

    if(measureIndex === currentPlayingNote.measure && isPlaying) {
      color = '#267754';
      strokeWidth = 1;
    } else if(!isValid) {
      color = 'red';
      strokeWidth = 1;
    } else {
      color = '#999999';
      strokeWidth = 0.1;
    }

    return <Bars x={x} measureWidth={measureWidth} color={color} strokeWidth={strokeWidth} />;
  }

  renderCursor = (xOfMeasure) => {
    const { noteIndex, stringIndex, measureIndex } = this.props.currentEditingIndex;
    if(this.props.totalMeasureIndex === measureIndex && !this.props.isPlaying) {
      const x = this.calcXForNote(xOfMeasure, noteIndex, measureIndex);
      const y = 79 - (13 * stringIndex);

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

  renderNote = (note, measureIndex, noteIndex, xOfMeasure) => {
    const x = this.calcXForNote(xOfMeasure, noteIndex, measureIndex);
    const { currentPlayingNote, isPlaying } = this.props;

    let color = 'black';
    if(currentPlayingNote.measure === measureIndex && currentPlayingNote.noteIndex === noteIndex && isPlaying) {
      color = '#f9423a';
    }

    if(note.string[0] === 'rest') {
      return <Rest onClick={this.onClick.bind(this, noteIndex, 0)} key={noteIndex} color={color} x={x} y={0} note={note} />;
    }

    return note.string.map((string, i) => {
      const y = 80 - (13 * string);
      return (
        <g>
          <TabNote onClick={this.onClick.bind(this, noteIndex, string)} key={i} duration={note.duration} x={x} y={y} color={color}
            fret={note.fret[i]} dotted={note.dotted}
          />
        </g>
      );
    });
  }

  renderTimeSignature = (totalMeasureIndex, x, measure) => {
    x = totalMeasureIndex === 0 ? x + 36 : x + 20;
    const { renderTimeSignature, timeSignature } = measure;

    return renderTimeSignature ? <TimeSignature x={x} numerator={timeSignature[0]} denominator={timeSignature.slice(2, 4)} /> : null;
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
    const { measure, x, y, totalMeasureIndex } = this.props;

    return (
      <svg x={0} y={y} style={{ height: 250, width: measure.width }}>
        { this.renderMeasure(totalMeasureIndex, measure, x) }
        { totalMeasureIndex === 0 ? <Clef /> : null }
        { this.renderTimeSignature(totalMeasureIndex, x, measure) }
        { this.renderCursor(x) }
      </svg>
    );
  }
}
