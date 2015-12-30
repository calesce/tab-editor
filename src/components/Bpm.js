import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Bpm extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const style = {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'default',
      fontSize: 9
    };
    const text = `= ${this.props.bpm}`;

    return (
      <svg x={5} y={4}>
        <g transform='scale(0.35)' fill='#000000' stroke='#000000'>
          <path strokeWidth={0.2}
            d="M 11.09297,39.38984 C 14.48881,37.56987 16.29825,34.27529 15.18519,31.79688 C 13.99793,29.15324 9.91818,28.40716 6.07861,30.13151 C 2.23905,31.85587 0.08645,35.40091 1.27371,38.04454 C 2.46098,40.68818 6.54072,41.43426 10.38029,39.70991 C 10.62026,39.60214 10.86657,39.51117 11.09297,39.38984 z "
            fill='#000000'
          />
          <path strokeWidth={1.5} d="M 14.72547,33.05645 L 14.72547,4.46888" stroke='#000000' />
        </g>
        <text x={9} y={13} style={style}>{text}</text>
      </svg>
    );
  }
}
