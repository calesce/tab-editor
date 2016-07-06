import React, { Component } from 'react';

export default class Repeat extends Component {
  render() {
    const { measureWidth, strings, y } = this.props;
    const x = measureWidth - 5;
    const height = 25 + (strings - 3) * 13 + 1;
    const topDotY = y + height - 10;
    const bottomDotY = y + height + 6;

    return (
      <g>
        <rect x={x - 2} y={y + 25} height={height} width={2} strokeWidth={0.1} fill='#2d2d2d'></rect>
        <rect x={x + 3} y={y + 25} height={height} width={2} strokeWidth={0.1} fill='#2d2d2d'></rect>
        <circle cx={x - 8} cy={topDotY} r={2.5} />
        <circle cx={x - 8} cy={bottomDotY} r={2.5} />
      </g>
    );
  }
}
