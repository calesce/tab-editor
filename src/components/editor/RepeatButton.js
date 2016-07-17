import React from 'react';
import { connect } from 'react-redux';
import { toggleRepeatEnd } from '../../actions/measure';

import hover from './hoverContainer';

const isSelected = state => {
  return {
    cursor: state.cursor,
    selected: state.tracks.present[state.currentTrackIndex].measures[state.cursor.measureIndex].repeatEnd
  };
};

export const RepeatEnd = connect(
  isSelected, { toggleRepeatEnd }
)(hover()(({ style, color, cursor, selected, toggleRepeatEnd }) => {
  if(selected) {
    color = '#b3caf5';
  }
  const onClick = () => {
    toggleRepeatEnd(cursor);
  };

  return (
    <svg onClick={onClick} width='40' height='50' style={style}>
      <rect x={17.5} y={3} height={38} width={0.8} strokeWidth={0.1} fill={color}></rect>
      <rect x={21} y={3} height={38} width={3} strokeWidth={0.1} fill={color}></rect>
      <circle cx={13} cy={18} r={2} fill={color }/>
      <circle cx={13} cy={28} r={2} fill={color} />
    </svg>
  );
}));

export const RepeatStart = hover()(({ style, color }) => {
  return (
    <svg width='40' height='50' style={style}>
      <rect x={14} y={3} height={38} width={3} strokeWidth={0.1} fill={color}></rect>
      <rect x={19.5} y={3} height={38} width={0.8} strokeWidth={0.1} fill={color}></rect>
      <circle cx={25} cy={18} r={2} fill={color }/>
      <circle cx={25} cy={28} r={2} fill={color} />
    </svg>
  );
});
