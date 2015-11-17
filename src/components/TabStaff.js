import React, { Component } from 'react';
import TabNote from './TabNote';

export default class TabStaff extends Component {
  renderBars = () => {
    return (
      <g>
        <rect x="0" y="10" width="100%" height="1.5" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
        <rect x="0" y="23" width="100%" height="1.5" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
        <rect x="0" y="36" width="100%" height="1.5" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
        <rect x="0" y="49" width="100%" height="1.5" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
        <rect x="0" y="62" width="100%" height="1.5" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
        <rect x="0" y="75" width="100%" height="1.5" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>

        <rect x="0" y="10" width="1" height="65" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
        <rect x="99.9%" y="10" width="1.5" height="65" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
      </g>
    );
  }

  renderNotes = (note, i) => {
    return note.string.map((bleh, j) => {
      let y = 80 - (13 * note.string[j]);

      return <TabNote key={j} x={i * 100 + 100} y={y} color={note.color} fret={note.fret[j]} />
    });
  }

  render() {
    let style = {
      height: 250,
      width: '80%'
    };

    let notes = this.props.notes.map((note, i) => {
      let color = (i === this.props.currentNoteIndex - 1) && this.props.isPlaying ? '#f9423a' : '#000000';

      return {
        string: note.string,
        fret: note.fret,
        duration: note.duration,
        color: color
      };
    });

    return (<svg style={style}>

      { this.renderBars() }
      {
        notes.map((note, i) => {
          return (
            <g key={i}>
              { this.renderNotes(note, i) }
            </g>
          )
        })
      }
    </svg>);
  }
}
