import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default class TabNote extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { x, y, fret } = this.props;

    const width = fret > 9 ? 18 : 12;
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
