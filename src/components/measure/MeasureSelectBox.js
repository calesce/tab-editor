import React, { PureComponent } from 'react';

export default class SelectBox extends PureComponent {
  render() {
    const { height, selectRange, measure } = this.props;
    const { notes, width, measureIndex } = measure;

    if (!selectRange || !selectRange[measureIndex]) {
      return null;
    }
    const selected = selectRange[measureIndex];

    let x, boxWidth;
    if (selected === 'all') {
      x = 0;
      boxWidth = width;
    } else {
      if (selected.length > 0) {
        if (selected[0] === 0) {
          x = 0;
        } else {
          x = notes[selected[0]].x - 15;
        }
        if (selected[selected.length - 1] === notes.length - 1) {
          boxWidth = width;
        } else {
          boxWidth = notes[selected[selected.length - 1] + 1].x - x - 15;
        }
      }
    }

    return (
      <rect
        fill="blue"
        fillOpacity={0.2}
        x={x}
        y={0}
        width={boxWidth}
        height={height}
      />
    );
  }
}
