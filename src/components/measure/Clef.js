import React, { PureComponent } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  cursor: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    cursor: 'default'
  }
});

export default class Clef extends PureComponent {
  renderTabClef(x, y) {
    const { strings } = this.props;
    const baseY = strings * (3 + 1 / 3) + y;
    // start closer to top for lower number of strings
    const interval = strings * 4 - 4;
    // more spaced out for more strings
    const fontSize = strings * 2 + 6;

    // the more strings, the larger the font default 18
    if (this.props.tab) {
      return (
        <g>
          <text
            x={x + 10}
            y={baseY}
            className={css(styles.cursor)}
            fill="#000000"
            fontSize={fontSize}
          >
            T
          </text>
          <text
            x={x + 10}
            y={baseY + interval}
            className={css(styles.cursor)}
            fill="#000000"
            fontSize={fontSize}
          >
            A
          </text>
          <text
            x={x + 10}
            y={baseY + 2 * interval}
            className={css(styles.cursor)}
            fill="#000000"
            fontSize={fontSize}
          >
            B
          </text>
        </g>
      );
    } else {
      return null;
    }
  }

  renderTrebleClef(x, y) {
    return (
      <svg x={x} y={y}>
        <path d="M27.098 22.0592c.61 6.2526-4.038 11.3126-8.1544 15.4028-1.8698 1.794-.31.296-1.2874 1.188-.2044-.958-.5972-3.462-.5604-4.22.2608-5.3878 4.6396-13.175 8.4762-16.0472.618 1.1534 1.126 1.2462 1.526 3.6764zm1.302 32.284c-2.464-1.812-5.7-2.288-8.6672-1.77-.3826-2.51-.7654-5.02-1.148-7.528 4.7012-4.658 9.8132-10.0644 10.0812-17.0788.118-4.464-.552-9.3428-3.356-12.9672-3.4008.25646-5.799 4.312-7.6038 6.833-2.9778 5.341-2.2828 11.8338-1.14 17.593-1.6188 1.904-3.8592 3.486-5.4548 5.468-4.7122 4.616-8.817 10.86-8.0092 17.756.36664 6.668 5.1788 12.868 11.7404 14.454 2.4914.63 5.1278.692 7.6482.198.4398 4.5 2.0532 9.258.185 13.626-1.4014 3.196-5.575 6.008-8.665 4.384-1.1988-.632-.2274-.102-.956-.504 2.1396-.514 3.9992-2.072 4.52-3.13 1.6756-2.928-.7996-7.278-4.3108-6.716-4.524.092-6.3808 6.28-3.4712 9.37 2.6936 3.04 7.666 2.624 10.8602.636 3.625-2.36 4.079-7.088 3.665-11.124-.14-1.356-.806-5.34-.888-6.774 1.394-.498.418-.118 2.386-.898 5.32-2.106 8.714-8.518 7.188-14.244-.636-2.938-2.088-5.828-4.604-7.584zm1.122 11.514c.428 3.982-2.106 8.642-6.158 9.92-.272-1.59-.344-2.022-.5252-2.95-.9644-4.92-1.488-9.974-2.232-14.962 3.2492-.336 6.9152 1.086 8.0452 4.368.488 1.154.686 2.394.87 3.624zm-10.2972 10.392c-5.0882.282-9.999-3.19-11.2686-8.162-1.498-4.306-1.0566-9.26 1.6414-13.008 2.2302-3.404 5.213-6.21 8.0572-9.086.366 2.254.732 4.508 1.098 6.764-5.9812 1.564-10.0092 9.45-6.43 14.902 1.0648 1.528 3.953 4.446 5.531 3.268-2.204-1.366-4.0066-3.718-3.619-6.454-.1642-2.564 2.7398-5.822 5.3026-6.396.8768 5.738 1.8826 12.146 2.7594 17.886-1.0108.2-2.0422.286-3.072.286z" />
      </svg>
    );
  }

  render() {
    const { y, repeatBegin, treble } = this.props;
    const x = repeatBegin ? 15 : 0;
    return treble ? this.renderTrebleClef(x, y) : this.renderTabClef(x, y);
  }
}
