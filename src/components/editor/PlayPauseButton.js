import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';

import { setCursor } from '../../actions/cursor';
import { setPlayingIndex } from '../../actions/playingIndex';

const styles = StyleSheet.create({
  disabled: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    fillOpacity: 0.2
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

const PlayButton = ({ onClick, canPlay }) => (
  <svg
    onClick={canPlay && onClick}
    width={40}
    height={50}
    className={css(canPlay ? styles.hover : styles.disabled)}
  >
    <g transform="scale(1.5), translate(1.5, 6)">
      <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </g>
  </svg>
);

const PauseButton = ({ onClick }) => (
  <svg onClick={onClick} width="40" height="50" className={css(styles.hover)}>
    <g transform="scale(1.5), translate(1.5, 6)">
      <path d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z" />
    </g>
  </svg>
);

class PlayPauseButton extends PureComponent {
  onPlayClick = () => {
    if (!this.props.playingIndex && this.props.canPlay) {
      this.props.setPlayingIndex(this.props.cursor);
    }
  };

  onPauseClick = () => {
    this.props.setCursor({
      measureIndex: this.props.playingIndex.measureIndex,
      noteIndex: this.props.playingIndex.noteIndex,
      stringIndex: this.props.cursor.stringIndex
    });
    this.props.setPlayingIndex(null);
  };

  render() {
    const { playingIndex, canPlay } = this.props;

    return playingIndex ? (
      <PauseButton onClick={this.onPauseClick} />
    ) : (
      <PlayButton onClick={this.onPlayClick} canPlay={canPlay} />
    );
  }
}

export default connect(
  state => ({ playingIndex: state.playingIndex, cursor: state.cursor }),
  {
    setPlayingIndex,
    setCursor
  }
)(PlayPauseButton);
