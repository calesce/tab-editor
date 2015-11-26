import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import TabNote from './TabNote';

export default class TabStaff extends Component {
  renderBars = (x, measureLength) => {
    return (
      <g>
        <rect x={x} y='10' width={measureLength} height='0.5' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={x} y='23' width={measureLength} height='0.5' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={x} y='36' width={measureLength} height='0.5' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={x} y='49' width={measureLength} height='0.5' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={x} y='62' width={measureLength} height='0.5' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={x} y='75' width={measureLength} height='0.5' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>

        <rect x={x} y='10' width='0.5' height='65' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={x + measureLength} y='10' width='0.5' height='65' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
      </g>
    );
  }

  renderMeasure = (i, measureLength, measure, x) => {
    return (
      <g>
        { this.renderBars(x, measureLength) }
        {
          measure.notes.map((note, j) => this.renderNote(note, i, j, measureLength))
        }
      </g>
    );
  }

  renderNote = (note, measureNumber, index, measureLength) => {
    let xOfMeasure = this.getXCoordOfMeasure(measureNumber);

    return note.string.map((bleh, j) => {
      let x = xOfMeasure + (index * 55 + 40);
      let y = 80 - (13 * note.string[j]);

      let { currentNote, isPlaying } = this.props;

      let color = 'black';
      if(currentNote.measure === measureNumber && currentNote.noteIndex === index && isPlaying) {
        color = '#f9423a';
      }

      return <TabNote key={j} x={x} y={y} color={color} fret={note.fret[j]} />;
    });
  }

  calcRows = (song) => {
    let measuresPerRow = Math.floor(window.innerWidth / 250);

    return Math.ceil(song.length / measuresPerRow);
  }

  getXCoordOfMeasure = (index) => {
    if(index % 5 === 0) {
      return 0;
    }

    let precedingMeasures = this.props.song.slice(index - index % 5, index);
    return precedingMeasures.reduce((prev, curr) => {
      return prev + (60 * curr.notes.length);
    }, 0);
  }

  renderAllMeasures = (measure, i) => {
    let y = 170 * (Math.floor(i / 5));
    let measureLength = 60 * measure.notes.length;

    let x = this.getXCoordOfMeasure(i);

    return (
      <svg key={i} x='0' y={y} style={{ height: 250, width: measureLength }}>
        { this.renderMeasure(i, measureLength, measure, x) }
      </svg>
    );
  }

  render() {
    let rows = this.calcRows(this.props.song);

    return (
      <svg style={{ width: '100%', height: '100%' }}>
        { this.props.song.map(this.renderAllMeasures) }
      </svg>
    );
  }
}
