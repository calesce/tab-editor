import React, { Component } from 'react';

export default class RepeatSign extends Component {
  render() {
    const { measureWidth, strings, y, repeatEnd } = this.props;
    const height = y + (strings - 3) * 13 + 1;
    const topDotY = y + 2 / 5 * height;
    const bottomDotY = y + 3 / 5 * height;

    if (repeatEnd) {
      return (
        <g>
          <rect
            x={measureWidth - 7}
            y={y}
            height={height}
            width={0.8}
            strokeWidth={0.1}
            fill="#2d2d2d"
          />
          <rect
            x={measureWidth - 3}
            y={y}
            height={height}
            width={3}
            strokeWidth={0.1}
            fill="#2d2d2d"
          />
          <circle cx={measureWidth - 13} cy={topDotY} r={2.5} />
          <circle cx={measureWidth - 13} cy={bottomDotY} r={2.5} />
        </g>
      );
    }
    return (
      <g>
        <rect
          x={5.5}
          y={y}
          height={height}
          width={0.8}
          strokeWidth={0.1}
          fill="#2d2d2d"
        />
        <rect
          x={0}
          y={y}
          height={height}
          width={3}
          strokeWidth={0.1}
          fill="#2d2d2d"
        />
        <circle cx={11.5} cy={topDotY} r={2.5} />
        <circle cx={11.5} cy={bottomDotY} r={2.5} />
      </g>
    );
  }
}
