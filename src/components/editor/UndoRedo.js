import React from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import hover from './hoverContainer';

const disabledStyle = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  opacity: 0.2
};

const { undo, redo } = ActionCreators;

const canUndo = state => {
  return { canUndo: state.tracks.past.length > 1 };
};

const canRedo = state => {
  return { canRedo: state.tracks.future.length > 0 };
};

export const UndoButton =
  connect(canUndo, { undo })(
    hover()(({ style, color, canUndo, undo }) => (
      <svg onClick={undo} width={40} height={50} style={canUndo ? style : disabledStyle}>
        <g transform='scale(1.5), translate(1.5, 6)'>
          <path fill={canUndo ? color : 'black'}
            d='M12.5 8c-2.65 0-5.05.99-6.9 2.6l-3.6-3.6v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78c-1.39-4.19-5.32-7.22-9.97-7.22z'
          />
        </g>
      </svg>
    )
  )
);

export const RedoButton =
  connect(canRedo, { redo })(
    hover()(({ style, color, canRedo, redo }) => (
      <svg onClick={redo} width='40' height='50' style={canRedo ? style : disabledStyle}>
        <g transform='scale(1.5), translate(1.5, 6)'>
          <path fill={canRedo ? color : 'black'}
            d='M18.4 10.6c-1.85-1.61-4.25-2.6-6.9-2.6-4.65 0-8.58 3.03-9.96 7.22l2.36.78c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88l-3.62 3.62h9v-9l-3.6 3.6z'
          />
        </g>
      </svg>
    )
  )
);
