import React, { Component } from 'react';
import TabNote from './TabNote';

/*.map((note, i) => {
  let color = (i === this.props.currentNoteIndex - 1) && this.props.isPlaying ? '#f9423a' : '#000000';

  return {
    string: note.string,
    fret: note.fret,
    duration: note.duration,
    color: color
  };
});*/

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
        { this.renderBars(i, measureLength) }
        {
          measure.notes.map((note, j) => this.renderNotes(note, i, j))
        }
      </g>
    );
  }

  renderNotes = (note, measureNumber, index) => {
    return note.string.map((bleh, j) => {
      let x = (measureNumber * 255) + (index * 55 + 40);
      let y = 80 - (13 * note.string[j]);

      return <TabNote key={j} x={x} y={y} color={note.color} fret={note.fret[j]} />;
    });
  }

  render() {
    let measureLength = 250;

    let style = {
      height: 250,
      width: measureLength
    };

    let song = this.props.song;

    return (<svg style={{ width: '100%' }}>
      {
        this.props.song.map((measure, i) => {
          return (
            <g key={i} style={style}>
              { this.renderMeasure(i, measureLength, measure) }
            </g>
          );
        })
      }
    </svg>);
  }
}
