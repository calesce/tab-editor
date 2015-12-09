import React, { Component } from 'react';

export default class TabNote extends Component {
  render() {
    let { x, y, fret, color} = this.props;

    let width = 14;
    if(fret > 9) {
      width += 6;
    }

    let style = {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'crosshair'
    };

    return (
      <g>
        <rect x={x} y={y-7} height={5.5} width={width} fill='#ffffff' stroke='#ffffff'></rect>
        <text x={x+2} y={y} fill={color} style={style}>{fret}</text>
      </g>
    );
  }
}
