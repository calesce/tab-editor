import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Bars extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  renderBar = (i, color, stringCount, strokeWidth, measureWidth) => {
    const c = i === 0 || i === stringCount - 1 ? color : '#999999';
    const width = i === 0 || i === stringCount - 1 ? strokeWidth : '0.1';

    return <rect key={i} y={25 + i * 13} width={measureWidth} height={0.5} fill={c} stroke={c} strokeWidth={width}></rect>;
  };

  render() {
    const { measureWidth, color, strokeWidth, strings, lastMeasure } = this.props;
    const startY = 25;
    const height = startY + (strings.length - 3) * 13 + 1;

    const x = lastMeasure ? measureWidth - 1 : measureWidth - 0.5;
    const width = lastMeasure ? 1.0 : 0.5;

    return (
      <g>
        { strings.map((_, i) => this.renderBar(i, color, strings.length, strokeWidth, measureWidth)) }

        <rect y={startY} width={0.5} height={height} fill={color} stroke={'#999999'} strokeWidth={strokeWidth}></rect>
        <rect x={x} y={startY} width={width} height={height} fill={'#999999'} stroke={color} strokeWidth={strokeWidth}></rect>
        { lastMeasure ?
            <rect x={measureWidth - 3.5} y={startY} width={.75} height={height} fill={'#999999'} stroke={color} strokeWidth={0.1}></rect> :
            null
        }
      </g>
    );
  }
}
