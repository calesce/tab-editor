import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import TabNote from './TabNote';

export default class TabStaff extends Component {
  renderBars = (i, measureLength) => {
    return (
      <g>
        <rect x={250 * i} y='10' width={measureLength} height='0.5' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth={0.1} font='10pt Arial'></rect>
        <rect x={250 * i} y='23' width={measureLength} height='0.5' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={250 * i} y='36' width={measureLength} height='0.5' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={250 * i} y='49' width={measureLength} height='0.5' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={250 * i} y='62' width={measureLength} height='0.5' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={250 * i} y='75' width={measureLength} height='0.5' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>

        <rect x={250 * i} y='10' width='0.5' height='65' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={250 * i + measureLength } y='10' width='0.5' height='65' rx='0' ry='0' fill='#000000' stroke='#000000' strokeWidth='0.1' font='10pt Arial'></rect>
      </g>
    );
  }

  renderMeasure = (i, measureLength, measure) => {
    return (
      <g>
        { this.renderBars(i % 5, measureLength) }
        {
          measure.notes.map((note, j) => this.renderNotes(note, i, j))
        }
      </g>
    );
  }

  renderNotes = (note, measureNumber, index) => {
    return note.string.map((bleh, j) => {
      let x = ((measureNumber % 5) * 255) + (index * 55 + 40);
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

  render() {
    let rows = this.calcRows(this.props.song);

    return (
      <svg style={{ width: '100%', height: '100%' }}>
        {
          this.props.song.map((measure, i) => {
            let y = 200 * (Math.floor(i / 5));

            return (
              <svg key={i} x='0' y={y} style={{ height: 250, width: 250 }}>
                { this.renderMeasure(i, 250, measure) }
              </svg>
            );
          })
        }
      </svg>
    );
  }
}
