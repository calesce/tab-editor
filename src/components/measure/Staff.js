import React, { PureComponent } from 'react';
import { range } from 'lodash';

const SPACE_BETWEEN_BARS = 13;

const styles = {
  true: { color: '#999999', strokeWidth: 0.1 },
  false: { color: 'red', strokeWidth: 1 }
};

export default class Staff extends PureComponent {
  renderBar(i, y, color, stringCount, strokeWidth, measureWidth) {
    const c = i === 0 || i === stringCount - 1 ? color : '#999999';
    const width = i === 0 || i === stringCount - 1 ? strokeWidth : '0.1';

    return (
      <rect
        key={i}
        y={y + i * SPACE_BETWEEN_BARS}
        width={measureWidth}
        height={0.5}
        fill={c}
        stroke={c}
        strokeWidth={width}
      />
    );
  }

  render() {
    const { measureWidth, strings, lastMeasure, y, isValid } = this.props;
    const { strokeWidth, color } = styles[isValid];
    const startY = 25 + y;
    const height = 25 + (strings - 3) * SPACE_BETWEEN_BARS + 1;

    const x = lastMeasure ? measureWidth - 1 : measureWidth - 0.5;
    const width = lastMeasure ? 1.0 : 0.5;

    return (
      <g>
        {range(strings).map((_, i) =>
          this.renderBar(i, startY, color, strings, strokeWidth, measureWidth)
        )}
        <rect
          y={startY}
          width={0.5}
          height={height}
          fill={color}
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <rect
          x={x}
          y={startY}
          width={width}
          height={height}
          fill={'#999999'}
          stroke={color}
          strokeWidth={strokeWidth}
        />
        {lastMeasure ? (
          <rect
            x={measureWidth - 3.5}
            y={startY}
            width={0.75}
            height={height}
            fill={'#999999'}
            stroke={color}
            strokeWidth={0.1}
          />
        ) : null}
      </g>
    );
  }
}

Staff.defaultProps = { isValid: true };
