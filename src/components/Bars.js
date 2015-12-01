import React, { Component } from 'react';

export default class Bars extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.color === nextProps.color && this.props.x === nextProps.x && this.props.measureWidth === nextProps.measureWidth) {
      return false;
    }
    return true;
  }

  render() {
    let { x, measureWidth, color, strokeWidth } = this.props;

    return (
      <g>
        <rect x={x} y='10' width={measureWidth} height='0.5' fill={color} stroke={color} strokeWidth={strokeWidth}></rect>
        <rect x={x} y='23' width={measureWidth} height='0.5' fill='#999999' stroke='#999999' strokeWidth='0.1'></rect>
        <rect x={x} y='36' width={measureWidth} height='0.5' fill='#999999' stroke='#999999' strokeWidth='0.1'></rect>
        <rect x={x} y='49' width={measureWidth} height='0.5' fill='#999999' stroke='#999999' strokeWidth='0.1'></rect>
        <rect x={x} y='62' width={measureWidth} height='0.5' fill='#999999' stroke='#999999' strokeWidth='0.1'></rect>
        <rect x={x} y='75' width={measureWidth} height='0.5' fill={color} stroke={color} strokeWidth={strokeWidth}></rect>

        <rect x={x} y='10' width='0.5' height='65' fill={color} stroke={color} strokeWidth={strokeWidth}></rect>
        <rect x={x + measureWidth} y='10' width='0.5' height='65' fill={color} stroke={color} strokeWidth={strokeWidth}></rect>
      </g>
    );
  }
}
