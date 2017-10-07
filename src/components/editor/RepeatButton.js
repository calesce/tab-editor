import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';

import { toggleRepeatEnd, toggleRepeatBegin } from '../../actions/measure';

const styles = StyleSheet.create({
  selected: {
    ':hover': {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'pointer'
    },
    fill: '#b3caf5'
  },
  hover: {
    ':hover': {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'pointer',
      fill: '#b3caf5'
    },
    fill: 'black'
  }
});

const isSelected = repeatEnd => state => {
  const measure =
    state.tracks.present[state.currentTrackIndex].measures[
      state.cursor.measureIndex
    ];
  return {
    cursor: state.cursor,
    selected: repeatEnd ? measure.repeatEnd : measure.repeatBegin
  };
};

export const RepeatEnd = connect(isSelected(true), {
  toggleRepeatEnd
})(({ cursor, selected, toggleRepeatEnd }) => {
  const onClick = () => {
    toggleRepeatEnd(cursor);
  };

  return (
    <svg
      onClick={onClick}
      width="40"
      height="50"
      className={css(selected ? styles.selected : styles.hover)}
    >
      <rect x={17.5} y={3} height={38} width={0.8} strokeWidth={0.1} />
      <rect x={21} y={3} height={38} width={3} strokeWidth={0.1} />
      <circle cx={13} cy={18} r={2} />
      <circle cx={13} cy={28} r={2} />
    </svg>
  );
});

export const RepeatBegin = connect(isSelected(false), {
  toggleRepeatBegin
})(({ cursor, selected, toggleRepeatBegin }) => {
  const onClick = () => {
    toggleRepeatBegin(cursor);
  };

  return (
    <svg
      onClick={onClick}
      width="40"
      height="50"
      className={css(selected ? styles.selected : styles.hover)}
    >
      <rect x={14} y={3} height={38} width={3} strokeWidth={0.1} />
      <rect x={19.5} y={3} height={38} width={0.8} strokeWidth={0.1} />
      <circle cx={25} cy={18} r={2} />
      <circle cx={25} cy={28} r={2} />
    </svg>
  );
});
