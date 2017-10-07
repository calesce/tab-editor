import React from 'react';
import { connect } from 'react-redux';
import { insertTrack, deleteTrack } from '../../actions/tracks';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  button: {
    ':hover': {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'pointer',
      fill: '#b3caf5'
    },
    fill: 'black',
    fontSize: 36,
    fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif',
    fontWeight: 800
  }
});

export const InsertTrackButton = connect(null, {
  insertTrack
})(({ insertTrack }) => (
  <svg
    onClick={insertTrack}
    width="40"
    height="50"
    className={css(styles.button)}
  >
    <g transform="translate(8, 37)">
      <text>+</text>
    </g>
  </svg>
));

export const DeleteTrackButton = connect(null, {
  deleteTrack
})(({ deleteTrack }) => (
  <svg
    onClick={deleteTrack}
    width="40"
    height="50"
    className={css(styles.button)}
  >
    <g transform="translate(12, 35.5)">
      <text>-</text>
    </g>
  </svg>
));
