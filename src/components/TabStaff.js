import React, { Component } from 'react';
import { toneRow } from '../util';

export default class TabStaff extends Component {
  renderBars = () => {
    return (
      <g>
        <rect x="0" y="0" width="100%" height="1.5" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
        <rect x="0" y="13" width="100%" height="1.5" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
        <rect x="0" y="26" width="100%" height="1.5" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
        <rect x="0" y="39" width="100%" height="1.5" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
        <rect x="0" y="52" width="100%" height="1.5" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
        <rect x="0" y="65" width="100%" height="1.5" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>

        <rect x="0" y="0" width="1" height="65" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
        <rect x="99.9%" y="0" width="1.5" height="65" rx="0" ry="0" fill="#999999" stroke="#999999" strokeWidth="0.3" font="10pt Arial"></rect>
      </g>
    );
  }

  render() {
    let style = {
      height: 200,
      width: '80%'
    };

    let notes = this.props.notes.map((note, i) => {
      let color = (i === this.props.currentNoteIndex - 1) && this.props.isPlaying ? '#f9423a' : '#000000';

      return {
        note: toneRow[note],
        color: color
      };
    });

    return (<svg style={style}>

      { this.renderBars() }
      {
        notes.map((note, i) => {
          return (
            <g key={i}>
              <rect x={i * 100 + 100} y={50} height={5.5} width={14} fill='#ffffff' stroke='#ffffff'></rect>
              <text x={i * 100 + 102} y={57} fill={note.color} >{note.note + 3}</text>
            </g>
          )
        })
      }
    </svg>);
  }
}
