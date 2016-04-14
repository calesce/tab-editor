import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class SelectBox extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { height, selected, measureWidth } = this.props;
    let x, width;
    if(selected === 'all') {
      x = 0;
      width = measureWidth;
    } else if(selected) {
      x = selected.start;
      width = selected.width;
    }

    return selected ?
      <rect fill='blue' fillOpacity={0.2} x={x} y={0} width={width} height={height}/> :
      null;
  }
}
