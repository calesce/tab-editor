import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class SelectBox extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { height, selected, measure } = this.props;
    let x, width;
    if(selected === 'all') {
      x = 0;
      width = measure.width;
    } else if(selected) {
      if(selected.length > 0) {
        x = selected[0] === 0 ? 0 : measure.notes[selected[0]].x - 20;
        if(selected[selected.length - 1] === measure.notes.length - 1) {
          width = measure.width;
        } else {
          width = measure.notes[selected[selected.length - 1]].x + 20;
        }
      }
    }

    return selected ?
      <rect fill='blue' fillOpacity={0.2} x={x} y={0} width={width} height={height} /> :
      null;
  }
}
