import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';

import { toggleMetronome, toggleCountdown } from '../../actions/playingIndex';

const styles = StyleSheet.create({
  selected: {
    ':hover': {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'pointer'
    },
    fill: '#b3caf5',
    stroke: '#b3caf5'
  },
  hover: {
    ':hover': {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'pointer',
      fill: '#b3caf5',
      stroke: '#b3caf5'
    },
    fill: 'black',
    stroke: 'black'
  }
});

const isMetronomeSelected = state => ({ selected: state.metronome === true });
const isCountdownSelected = state => ({ selected: state.countdown === true });

const UnconnectedMetronomeButton = ({ selected, cursor, toggleMetronome }) => {
  const onClick = () => {
    toggleMetronome(cursor);
  };

  return (
    <svg
      onClick={onClick}
      width="40"
      height="50"
      className={css(selected ? styles.selected : styles.hover)}
    >
      <g transform="translate(3.5, 8), scale(0.2)">
        <polygon
          fill="none"
          strokeWidth="6"
          points="4 178 154 178 104 3 54 3"
        />
        <path d="M84,147.5 L173.5,4.5" strokeWidth="7" />
        <polygon
          strokeWidth="0.81"
          points="145.627358 28.2000008 138.490005 50.8611911 147.041157 56.2045437 164.284416 39.8582246"
        />
        <polyline points="6 176.297476 14 140 144 140 153 176.399994" />
      </g>
    </svg>
  );
};

const UnconnectedCountdown = ({ selected, cursor, toggleCountdown }) => {
  const onClick = () => {
    toggleCountdown(cursor);
  };

  return (
    <svg
      onClick={onClick}
      width="40"
      height="50"
      className={css(selected ? styles.selected : styles.hover)}
    >
      <g transform="translate(1, 5.5), scale(1.6)">
        <path
          strokeWidth="0.1"
          d="M15 1h-6v2h6v-2zm-4 13h2v-6h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42c-1.55-1.24-3.5-1.98-5.62-1.98-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zm-7.03 12.61c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
        />
      </g>
    </svg>
  );
};

export const MetronomeButton = connect(isMetronomeSelected, {
  toggleMetronome
})(UnconnectedMetronomeButton);

export const CountdownButton = connect(isCountdownSelected, {
  toggleCountdown
})(UnconnectedCountdown);
