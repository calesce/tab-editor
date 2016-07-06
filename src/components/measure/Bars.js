import React, { Component } from 'react';
import { range } from 'lodash';
import shallowCompare from 'react-addons-shallow-compare';

export default class Bars extends Component {
  constructor() {
    super();

    this.renderBar = this.renderBar.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  renderBar(i, y, color, stringCount, strokeWidth, measureWidth) {
    const c = i === 0 || i === stringCount - 1 ? color : '#999999';
    const width = i === 0 || i === stringCount - 1 ? strokeWidth : '0.1';

    return <rect key={i} y={y + i * this.props.spaceBetweenBars} width={measureWidth} height={0.5}
      fill={c} stroke={c} strokeWidth={width}></rect>;
  }

  render() {
    const { measureWidth, color, strokeWidth, strings, lastMeasure, y, spaceBetweenBars } = this.props;
    const startY = 25 + y;
    const height = 25 + (strings - 3) * spaceBetweenBars + 1;

    const x = lastMeasure ? measureWidth - 1 : measureWidth - 0.5;
    const width = lastMeasure ? 1.0 : 0.5;

    return (
      <g>
        { range(strings).map((_, i) => this.renderBar(i, startY, color, strings, strokeWidth, measureWidth)) }
        <rect y={startY} width={0.5} height={height} fill={color} stroke={color} strokeWidth={strokeWidth}></rect>
        <rect x={x} y={startY} width={width} height={height} fill={'#999999'} stroke={color} strokeWidth={strokeWidth}></rect>
        { lastMeasure ?
            <rect x={measureWidth - 3.5} y={startY} width={.75} height={height} fill={'#999999'} stroke={color} strokeWidth={0.1}></rect> :
            null
        }
      </g>
    );
  }
}
