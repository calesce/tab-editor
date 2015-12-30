import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Bars extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { measureWidth, color, strokeWidth } = this.props;

    return (
      <g>
        <rect y='20' width={measureWidth} height='0.5' fill={color} stroke={color} strokeWidth={strokeWidth}></rect>
        <rect y='33' width={measureWidth} height='0.5' fill='#999999' stroke='#999999' strokeWidth='0.1'></rect>
        <rect y='46' width={measureWidth} height='0.5' fill='#999999' stroke='#999999' strokeWidth='0.1'></rect>
        <rect y='59' width={measureWidth} height='0.5' fill='#999999' stroke='#999999' strokeWidth='0.1'></rect>
        <rect y='72' width={measureWidth} height='0.5' fill='#999999' stroke='#999999' strokeWidth='0.1'></rect>
        <rect y='85' width={measureWidth} height='0.5' fill={color} stroke={color} strokeWidth={strokeWidth}></rect>

        <rect y='20' width='0.5' height='65' fill={color} stroke={color} strokeWidth={strokeWidth}></rect>
        <rect x={measureWidth - 0.1} y='20' width='0.5' height='65' fill={color} stroke={color} strokeWidth={strokeWidth}></rect>
      </g>
    );
  }
}
