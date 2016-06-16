import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addRepeatEnd } from '../../actions/measure';

import hover from './hoverContainer';

const isSelected = state => {
  const { cursor, currentTrackIndex, tracks } = state.present;
  return {
    cursor,
    selected: tracks[currentTrackIndex].measures[cursor.measureIndex].repeatEnd
  };
};

const mapDispatchEnd = dispatch => {
  return {
    addRepeatEnd: bindActionCreators(addRepeatEnd, dispatch)
  };
};

export const RepeatEnd = connect(isSelected, mapDispatchEnd)(hover()(({ style, color, cursor, selected, addRepeatEnd }) => {
  if(selected) {
    color = '#b3caf5';
  }
  const onClick = () => {
    addRepeatEnd(cursor);
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
