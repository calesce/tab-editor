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
    const { measureWidth, color, strokeWidth, strings } = this.props;
    const startY = 25;
    const height = startY + (strings.length - 3) * 13 + 1;

    return (
      <g>
        { strings.map((_, i) => this.renderBar(i, color, strings.length, strokeWidth, measureWidth)) }

        <rect y={startY} width={0.5} height={height} fill={color} stroke={'#2d2d2d'} strokeWidth={strokeWidth}></rect>
        <rect x={measureWidth - 0.1} y={startY} width={0.5} height={height} fill={'#2d2d2d'} stroke={color} strokeWidth={strokeWidth}></rect>
      </g>
    );
  }
}
