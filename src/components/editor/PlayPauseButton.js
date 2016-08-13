import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { setCursor } from '../../actions/cursor';
import { setPlayingIndex } from '../../actions/playingIndex';
import hover from './hoverContainer';

const PlayButton = ({ onClick, style, color, canPlay }) => (
  <svg onClick={canPlay ? onClick : null} width={40} height={50} style={style}>
    <g transform='scale(1.5), translate(1.5, 6)'>
      <path fill={canPlay ? color : 'black'} fillOpacity={canPlay ? 1.0 : 0.1}
        d='M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'></path>
    </g>
  </svg>
);

const PauseButton = ({ onClick, style, color }) => (
  <svg onClick={onClick} width='40' height='50' style={style}>
    <g transform='scale(1.5), translate(1.5, 6)'>
      <path fill={color} d='M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z'></path>
    </g>
  </svg>
);

class PlayPauseButton extends PureComponent {
  constructor() {
    super();

    this.onPlayClick = this.onPlayClick.bind(this);
    this.onPauseClick = this.onPauseClick.bind(this);
  }

  onPlayClick() {
    if(!this.props.playingIndex && this.props.canPlay) {
      this.props.setPlayingIndex(this.props.cursor);
    }
  }

  onPauseClick() {
    this.props.setCursor({
      measureIndex: this.props.playingIndex.measureIndex,
      noteIndex: this.props.playingIndex.noteIndex,
      stringIndex: this.props.cursor.stringIndex
    });
    this.props.setPlayingIndex(null);
  }

  render() {
    const { style, color, playingIndex, canPlay } = this.props;

    return playingIndex ?
      <PauseButton onClick={this.onPauseClick} style={style} color={color} /> :
      <PlayButton onClick={this.onPlayClick} style={style} color={color} canPlay={canPlay} />;
  }
}

export default connect(
  state => ({
    playingIndex: state.playingIndex,
    cursor: state.cursor
  }),
  { setPlayingIndex, setCursor }
)(hover()(PlayPauseButton));
