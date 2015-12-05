import React, { Component } from 'react';

import TabNote from './TabNote';
import Bars from './Bars';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Cursor from './Cursor';

export default class Measure extends Component {
  calcXForNote = (xOfMeasure, noteIndex, measureIndex, timeSignature) => {
    let x = xOfMeasure + (noteIndex * 55 + 40);
    if(measureIndex === 0) {
      x += 15;
    }
    if(this.props.measure.timeSignature) {
      x += 20;
    }
    return x;
  }

  renderBars = (x, measureWidth, measureIndex) => {
    let { currentPlayingNote, isPlaying } = this.props;

    let color = measureIndex === currentPlayingNote.measure && isPlaying ? '#267754' : '#999999';
    let strokeWidth = measureIndex === currentPlayingNote.measure && isPlaying ? '1' : '0.1';

    return <Bars x={x} measureWidth={measureWidth} color={color} strokeWidth={strokeWidth} />;
  }

  renderCursor = (xOfMeasure) => {
    const { noteIndex, stringIndex, measureIndex } = this.props.currentEditingIndex;
    if(this.props.totalMeasureIndex === measureIndex && !this.props.isPlaying) {
      let x = this.calcXForNote(xOfMeasure, noteIndex, measureIndex);
      let y = 79 - (13 * this.props.currentEditingIndex.stringIndex);

      return <Cursor x={x} y={y} />;
    }

    return null;
  }

  renderNote = (note, measureIndex, noteIndex, xOfMeasure) => {
    let x = this.calcXForNote(xOfMeasure, noteIndex, measureIndex);
    let { currentPlayingNote, isPlaying } = this.props;

    let color = 'black';
    if(currentPlayingNote.measure === measureIndex && currentPlayingNote.noteIndex === noteIndex && isPlaying) {
      color = '#f9423a';
    }

    if(note.string[0] === 'rest') {
      return <Rest key={noteIndex} color={color} x={x} y={0} duration={note.duration[0]} />;
    }

    return note.string.map((string, i) => {
      let y = 80 - (13 * string);

      return (
        <g>
          <TabNote key={i} x={x} y={y} color={color} fret={note.fret[i]} />
        </g>
      );
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
          measure.notes.map((note, noteIndex) => this.renderNote(note, measureIndex, noteIndex, x))
        }
      </g>
    );
  }

  render() {
    let { measure, x, y, totalMeasureIndex } = this.props;

    return (
      <svg x={0} y={y} style={{ height: 250, width: measure.width }}>
        { this.renderMeasure(totalMeasureIndex, measure, x) }
        { totalMeasureIndex === 0 ? <Clef /> : null }
        { this.renderTimeSignature(totalMeasureIndex, x, measure) }
        { this.renderCursor(x-1) }
      </svg>
    );
  }
}
