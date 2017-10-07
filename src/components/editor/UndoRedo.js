import React from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  disabled: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    opacity: 0.2
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

const { undo, redo } = ActionCreators;

const canUndo = state => {
  return { canUndo: state.tracks.past.length > 1 };
};

const canRedo = state => {
  return { canRedo: state.tracks.future.length > 0 };
};

export const UndoButton = connect(canUndo, { undo })(({ canUndo, undo }) => (
  <svg
    onClick={undo}
    width={40}
    height={50}
    className={css(canUndo ? styles.hover : styles.disabled)}
  >
    <g transform="scale(1.5), translate(5.5, 6)">
      <path d="M8 1c-2.209 0-4.209 0.896-5.657 2.343l-2.343-2.343v6h6l-2.243-2.243c1.086-1.086 2.586-1.757 4.243-1.757 3.314 0 6 2.686 6 6 0 1.792-0.786 3.401-2.032 4.5l1.323 1.5c1.661-1.466 2.709-3.611 2.709-6 0-4.418-3.582-8-8-8z" />
    </g>
  </svg>
));

export const RedoButton = connect(canRedo, { redo })(({ canRedo, redo }) => (
  <svg
    onClick={redo}
    width={40}
    height={50}
    className={css(canRedo ? styles.hover : styles.disabled)}
  >
    <g transform="scale(1.5), translate(1.5, 6)">
      <path d="M0 9c0 2.389 1.048 4.534 2.709 6l1.323-1.5c-1.246-1.099-2.031-2.708-2.031-4.5 0-3.314 2.686-6 6-6 1.657 0 3.157 0.672 4.243 1.757l-2.243 2.243h6v-6l-2.343 2.343c-1.448-1.448-3.448-2.343-5.657-2.343-4.418 0-8 3.582-8 8z" />
    </g>
  </svg>
));
