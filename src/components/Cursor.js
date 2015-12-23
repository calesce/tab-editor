import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TabNote extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    let { x, y, fret } = this.props;

    let width = fret > 9 ? 18 : 12;
    return (
      <g>
        <rect x={x} y={y-12} height={0.1} width={width} strokeWidth={0.1} stroke='black'></rect>
        <rect x={x} y={y+2} height={0.1} width={width} strokeWidth={0.1} stroke='black'></rect>
        <rect x={x} y={y-12} height={14} width={0.1} strokeWidth={0.1} stroke='black'></rect>
        <rect x={x + width} y={y-12} height={14} width={0.1} strokeWidth={0.1} stroke='black'></rect>
      </g>
    );
  }
}
