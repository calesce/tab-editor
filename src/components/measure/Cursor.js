import React, { PureComponent } from 'react';

export default class Cursor extends PureComponent {
  render() {
    const { x, y, fret } = this.props;

    const width = fret > 9 ? 18 : 12;
    return (
      <g>
        <rect
          x={x}
          y={y - 12}
          height={0.1}
          width={width}
          strokeWidth={0.1}
          stroke="black"
        />
        <rect
          x={x}
          y={y + 2}
          height={0.1}
          width={width}
          strokeWidth={0.1}
          stroke="black"
        />
        <rect
          x={x}
          y={y - 12}
          height={14}
          width={0.1}
          strokeWidth={0.1}
          stroke="black"
        />
        <rect
          x={x + width}
          y={y - 12}
          height={14}
          width={0.1}
          strokeWidth={0.1}
          stroke="black"
        />
      </g>
    );
  }
}
