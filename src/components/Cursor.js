import React, { Component } from 'react';

export default class TabNote extends Component {
  render() {
    let { x, y } = this.props;

    return (
      <g>
        <rect x={x} y={y-12} height={0.1} width={14} strokeWidth={0.1} stroke='black'></rect>
        <rect x={x} y={y+2} height={0.1} width={14} strokeWidth={0.1} stroke='black'></rect>
        <rect x={x} y={y-12} height={14} width={0.1} strokeWidth={0.1} stroke='black'></rect>
        <rect x={x+14} y={y-12} height={14} width={0.1} strokeWidth={0.1} stroke='black'></rect>
      </g>
    );
  }
}
