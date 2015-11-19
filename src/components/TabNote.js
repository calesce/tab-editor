import React, { Component } from 'react';

export default class TabNote extends Component {
  render() {
    let { x, y, fret, color} = this.props;

    return (
      <g>
        <rect x={x} y={y-7} height={5.5} width={14} fill='#ffffff' stroke='#ffffff'></rect>
        <text x={x+2} y={y} fill={color} >{fret}</text>
      </g>
    );
  }
}
