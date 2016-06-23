import React from 'react';
import { connect } from 'react-redux';
import { insertTrack, deleteTrack } from '../../actions/tracks';

import hover from './hoverContainer';
const textStyle = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  cursor: 'pointer',
  fontSize: 36,
  fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif',
  fontWeight: 800
};

export const InsertTrackButton =
  connect(null, { insertTrack })(
    hover()(({ style, color, insertTrack }) => (
      <svg onClick={insertTrack} width='40' height='50' style={style}>
        <g transform='translate(8, 37)'>
          <text fill={color} style={textStyle}>+</text>
        </g>
      </svg>
    )
  )
);

export const DeleteTrackButton =
  connect(null, { deleteTrack })(
    hover()(({ style, color, deleteTrack }) => (
      <svg onClick={deleteTrack} width='40' height='50' style={style}>
        <g transform='translate(12, 35.5)'>
          <text fill={color} style={textStyle}>-</text>
        </g>
      </svg>
    )
  )
);
