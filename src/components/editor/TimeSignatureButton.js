import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popover from 'react-popover';

import { StyleSheet, css } from 'aphrodite';

import { timeSignatureSelector } from '../../util/selectors';
import TimeSignaturePopover from './TimeSignaturePopover';

const styles = StyleSheet.create({
  hover: {
    ':hover': {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'pointer',
      fill: '#b3caf5',
      stroke: '#b3caf5'
    },
    fill: 'black',
    stroke: 'black'
  },
  text: {
    fontSize: 17,
    fontWeight: 600,
    fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif'
  },
  popover: { zIndex: 5, fill: '#FEFBF7', marginLeft: -10 }
});

const TimeSignatureButton = ({ timeSignature, onClick }) => (
  <svg onClick={onClick} width="40" height="50" className={css(styles.hover)}>
    <g transform="translate(6, 30)">
      <text strokeWidth={0} className={css(styles.text)}>
        {`${timeSignature.beats}/${timeSignature.beatType}`}
      </text>
    </g>
  </svg>
);

class TimeSignature extends Component {
  constructor() {
    super();

    this.state = { popoverOpen: false };
  }

  onClick = () => {
    if (this.state.popoverOpen) {
      this.onPopoverClose();
    } else {
      this.setState({ popoverOpen: true });
    }
  };

  onPopoverClose = () => {
    this.setState({ popoverOpen: false });
  };

  render() {
    const { timeSignature, measureIndex } = this.props;
    const body = (
      <TimeSignaturePopover
        timeSignature={timeSignature}
        measureIndex={measureIndex}
      />
    );

    return (
      <div>
        <Popover
          className={css(styles.popover)}
          isOpen={this.state.popoverOpen}
          onOuterAction={this.onPopoverClose}
          body={body}
        >
          <TimeSignatureButton
            onClick={this.onClick}
            timeSignature={timeSignature}
          />
        </Popover>
      </div>
    );
  }
}

export default connect(state => ({
  timeSignature: timeSignatureSelector(state),
  measureIndex: state.cursor.measureIndex
}))(TimeSignature);
