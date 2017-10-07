import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';

import { changeTimeSignature } from '../../actions/track';
import HoverableText from './HoverableText';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif'
  },
  popoverContainer: {
    background: '#FEFBF7',
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  templateRow: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: 10
  },
  timeSigRow: { display: 'flex', justifyContent: 'center', flexShrink: 10 },
  checkboxRow: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5
  },
  beats: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 15,
    alignItems: 'flex-end',
    flexBasis: '55%'
  },
  beatType: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 15,
    alignItems: 'flex-end',
    flexBasis: '55%'
  },
  numberText: { fontSize: 40, paddingRight: 10 },
  topArrows: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 15,
    flexBasis: '45%'
  },
  bottomArrows: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 15,
    flexBasis: '45%'
  },
  checkboxText: { fontWeight: 300, fontSize: 12, paddingTop: 3 }
});

class TimeSignaturePopover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeSignature: Object.assign({}, props.timeSignature),
      toEndChecked: false,
      allChecked: false
    };
  }

  componentWillUnmount() {
    const { timeSignature, toEndChecked, allChecked } = this.state;
    this.props.changeTimeSignature(
      { measureIndex: this.props.measureIndex },
      timeSignature,
      toEndChecked,
      allChecked
    );
  }

  onTwoFourClick = () => {
    // TODO extract these things into a component
    this.setState({ timeSignature: { beats: 2, beatType: 4 } });
  };

  onFourFourClick = () => {
    this.setState({ timeSignature: { beats: 4, beatType: 4 } });
  };

  onSixEightClick = () => {
    this.setState({ timeSignature: { beats: 6, beatType: 8 } });
  };

  onIncrementBeats = () => {
    if (this.state.timeSignature.beats < 32) {
      this.setState({
        timeSignature: {
          beats: this.state.timeSignature.beats + 1,
          beatType: this.state.timeSignature.beatType
        }
      });
    }
  };

  onIncrementBeatType = () => {
    if (this.state.timeSignature.beatType < 32) {
      this.setState({
        timeSignature: {
          beats: this.state.timeSignature.beats,
          beatType: this.state.timeSignature.beatType * 2
        }
      });
    }
  };

  onDecrementBeats = () => {
    if (this.state.timeSignature.beats > 1) {
      this.setState({
        timeSignature: {
          beats: this.state.timeSignature.beats - 1,
          beatType: this.state.timeSignature.beatType
        }
      });
    }
  };

  onDecrementBeatType = () => {
    if (this.state.timeSignature.beatType > 1) {
      this.setState({
        timeSignature: {
          beats: this.state.timeSignature.beats,
          beatType: this.state.timeSignature.beatType / 2
        }
      });
    }
  };

  toEndChanged = () => {
    this.setState({ toEndChecked: !this.state.toEndChecked });
  };

  allChanged = () => {
    this.setState({ allChecked: !this.state.allChecked });
  };

  render() {
    return (
      <div className={css(styles.popoverContainer)}>
        <span className={css(styles.templateRow)}>
          <HoverableText onClick={this.onTwoFourClick} text="2/4" />
          <HoverableText onClick={this.onFourFourClick} text="4/4" />
          <HoverableText onClick={this.onSixEightClick} text="6/8" />
        </span>
        <div className={css(styles.timeSigRow)}>
          <span className={css(styles.beats)}>
            <h3 className={css(styles.text, styles.numberText)}>
              {this.state.timeSignature.beats}
            </h3>
          </span>
          <span className={css(styles.topArrows)}>
            <HoverableText onClick={this.onIncrementBeats} text="▲" />
            <HoverableText onClick={this.onDecrementBeats} text="▼" />
          </span>
        </div>
        <div className={css(styles.timeSigRow)}>
          <span className={css(styles.beatType)}>
            <h3 className={css(styles.text, styles.numberText)}>
              {this.state.timeSignature.beatType}
            </h3>
          </span>
          <span className={css(styles.bottomArrows)}>
            <HoverableText onClick={this.onIncrementBeatType} text="▲" />
            <HoverableText onClick={this.onDecrementBeatType} text="▼" />
          </span>
        </div>
        <span className={css(styles.checkboxRow)}>
          <small className={css(styles.text, styles.checkboxText)}>
            To End
          </small>
          <input
            type="checkbox"
            value={this.state.toEndChecked}
            onChange={this.toEndChanged}
          />
          <small className={css(styles.text, styles.checkboxText)}>
            All Measures
          </small>
          <input
            type="checkbox"
            value={this.state.allChecked}
            onChange={this.allChanged}
          />
        </span>
      </div>
    );
  }
}

export default connect(null, { changeTimeSignature })(TimeSignaturePopover);
