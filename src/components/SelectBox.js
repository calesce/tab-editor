import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

const SVG_TOP = 5;

const svgStyle = {
  position: 'absolute',
  left: 0,
  top: SVG_TOP,
  overflow: 'visible',
  pointerEvents: 'none'
};

export default class SelectBox extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { height, width, x, y, dragWidth, dragHeight } = this.props;

    return (
      <svg style={svgStyle} height={height} width={width}>
        {
          dragWidth && dragHeight ?
            <rect fill='blue' stroke='blue' fillOpacity={0.2} strokeOpacity={0.8}
              x={x} y={y} width={dragWidth} height={dragHeight} />
          : null
        }
      </svg>
    );
  }
}
