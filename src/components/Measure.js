import React, { Component } from 'react';

import TabNote from './TabNote';
import Bars from './Bars';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';

export default class Measure extends Component {
  calcXForNote = (xOfMeasure, noteIndex, measureIndex, timeSignature) => {
    let x = xOfMeasure + (noteIndex * 55 + 40);
    if(measureIndex === 0) {
      x += 15;
    }
    if(timeSignature) {
      x += 20;
    }
    return x;
  }

  renderBars = (x, measureWidth, measureIndex) => {
    let color = measureIndex === this.props.currentNote.measure && this.props.isPlaying ? '#267754' : '#999999';
    let strokeWidth = measureIndex === this.props.currentNote.measure && this.props.isPlaying ? '1' : '0.1';

    return <Bars x={x} measureWidth={measureWidth} color={color} strokeWidth={strokeWidth} />;
  }

  renderNote = (note, measureIndex, index, measureWidth, xOfMeasure, timeSignature) => {
    let x = this.calcXForNote(xOfMeasure, index, measureIndex, timeSignature);
    let { currentNote, isPlaying } = this.props;

    let color = 'black';
    if(currentNote.measure === measureIndex && currentNote.noteIndex === index && isPlaying) {
      color = '#f9423a';
    }

    if(note.string[0] === 'rest') {
      return <Rest key={index} color={color} x={x} y={0} duration={note.duration[0]} />;
    }

    return note.string.map((_, j) => {
      let y = 80 - (13 * note.string[j]);

      return <TabNote key={j} x={x} y={y} color={color} fret={note.fret[j]} />;
    });
  }

  renderTimeSignature = (totalMeasureIndex, x, measure) => {
    x = totalMeasureIndex === 0 ? x + 36 : x + 20;
    let { timeSignature } = measure;

    return timeSignature ? <TimeSignature x={x} numerator={timeSignature[0]} denominator={timeSignature[2]} /> : null;
  }

  renderMeasure = (measureIndex, measure, x) => {
    return (
      <g>
        { this.renderBars(x, measure.width, measureIndex) }
        {
          measure.notes.map((note, noteIndex) => this.renderNote(note, measureIndex, noteIndex, measure.width, x, measure.timeSignature))
        }
      </g>
    );
  }

  render() {
    let { measure, x, y, totalMeasureIndex, currentNote } = this.props;

    return (
      <svg x={0} y={y} style={{ height: 250, width: measure.width }}>
        { this.renderMeasure(totalMeasureIndex, measure, x) }
        { totalMeasureIndex === 0 ? <Clef /> : null }
        { this.renderTimeSignature(totalMeasureIndex, x, measure) }
      </svg>
    );
  }
}
