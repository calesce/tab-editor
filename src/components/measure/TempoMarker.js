import React, { PureComponent } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  cursor: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    cursor: 'default',
    fontSize: 9
  }
});

export default class Tempo extends PureComponent {
  render() {
    if (
      this.props.tab &&
      (this.props.displayOption !== 'tab' || !this.props.renderTempo)
    ) {
      return null;
    }
    const text = `= ${this.props.tempo}`;

    return (
      <svg x={5} y={this.props.y}>
        <g transform="scale(0.35)" fill="#000000" stroke="#000000">
          <path
            strokeWidth={0.2}
            d="M 11.09297,35.38984 C 14.48881,33.56987 16.29825,30.27529 15.18519,27.79688 C 13.99793,25.15324 9.91818,24.40716 6.07861,26.13151 C 2.23905,27.85587 0.08645,31.40091 1.27371,34.04454 C 2.46098,36.68818 6.54072,37.43426 10.38029,35.70991 C 10.62026,35.60214 10.86657,35.51117 11.09297,34.38984 z "
            fill="#000000"
          />
          <path
            strokeWidth={1.5}
            d="M 14.72547,29.05645 L 14.72547,0.46888"
            stroke="#000000"
          />
        </g>
        <text x={9} y={10} className={css(styles.cursor)}>
          {text}
        </text>
      </svg>
    );
  }
}
