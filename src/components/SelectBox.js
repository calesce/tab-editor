import React, { PureComponent } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
    left: 0,
    top: 5,
    overflow: 'visible',
    pointerEvents: 'none'
  }
});

export default class SelectBox extends PureComponent {
  render() {
    const { height, width, x, y, dragWidth, dragHeight } = this.props;

    return (
      <svg className={css(styles.svg)} height={height} width={width}>
        {dragWidth &&
          dragHeight && (
            <rect
              fill="blue"
              stroke="blue"
              fillOpacity={0.2}
              strokeOpacity={0.8}
              x={x}
              y={y}
              width={dragWidth}
              height={dragHeight}
            />
          )}
      </svg>
    );
  }
}
