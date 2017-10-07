import React from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  hover: {
    ':hover': {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'pointer',
      color: '#b3caf5'
    },
    color: 'black',
    fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif',
    fontSize: 20
  },
  light: { fontWeight: 500 },
  normal: { fontWeight: 600 },
  heavy: { fontWeight: 800 }
});

const HoverableText = ({ text, weight, onClick }) => (
  <span
    onClick={onClick}
    className={css(styles.hover, styles[weight] || styles.light)}
  >
    {text}
  </span>
);

export default HoverableText;
