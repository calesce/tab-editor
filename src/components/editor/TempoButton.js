import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popover from 'react-popover';
import { StyleSheet, css } from 'aphrodite';

import { changeTempo } from '../../actions/track';

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
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif'
  },
  light: { fontWeight: 300, fontSize: 12, paddingTop: 3 },
  textInput: {
    width: 70,
    margin: '5px 15px 0px 15px',
    ':focus': { outline: 'none' }
  },
  popover: { zIndex: 5, fill: '#FEFBF7', marginLeft: -10 },
  popoverContainer: {
    background: '#FEFBF7',
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  flexToEnd: { display: 'flex', justifyContent: 'flex-end', paddingRight: 12 },
  flexAllMeasures: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 12
  }
});

const TempoButton = ({ tempo, onClick }) => (
  <svg onClick={onClick} width="80" height="50" className={css(styles.hover)}>
    <g transform="translate(25, 12)">
      <g transform="scale(0.5)">
        <path
          strokeWidth={0.2}
          d="M 11.09297,35.38984 C 14.48881,33.56987 16.29825,30.27529 15.18519,27.79688 C 13.99793,25.15324 9.91818,24.40716 6.07861,26.13151 C 2.23905,27.85587 0.08645,31.40091 1.27371,34.04454 C 2.46098,36.68818 6.54072,37.43426 10.38029,35.70991 C 10.62026,35.60214 10.86657,35.51117 11.09297,34.38984 z "
        />
        <path strokeWidth={1.5} d="M 14.72547,29.05645 L 14.72547,0.46888" />
      </g>
      <g transform="translate(10, 17)">
        <text strokeWidth={0} className={css(styles.text)}>
          ={tempo}
        </text>
      </g>
    </g>
  </svg>
);

class TempoPopover extends Component {
  constructor(props) {
    super(props);

    this.state = { tempo: props.tempo, toEndChecked: false, allChecked: false };
  }

  componentDidMount() {
    if (this.textInput) {
      this.textInput.select();
    }
  }

  componentWillUnmount() {
    const { tempo, toEndChecked, allChecked } = this.state;
    this.props.changeTempo(this.props.cursor, tempo, toEndChecked, allChecked);
  }

  onTextChanged = e => {
    if (!isNaN(parseInt(e.target.value)) || e.target.value === '') {
      this.setState({ tempo: e.target.value });
    }
  };

  toEndChanged = () => {
    this.setState({ toEndChecked: !this.state.toEndChecked });
  };

  allChanged = () => {
    this.setState({ allChecked: !this.state.allChecked });
  };

  setInputRef = el => {
    this.textInput = el;
  };

  render() {
    return (
      <div className={css(styles.popoverContainer)}>
        <input
          ref={this.setInputRef}
          className={css(styles.textInput)}
          type="text"
          value={this.state.tempo}
          onChange={this.onTextChanged}
        />
        <span className={css(styles.flexToEnd)}>
          <small className={css(styles.text, styles.light)}>To End</small>
          <input
            type="checkbox"
            value={this.state.toEndChecked}
            onChange={this.toEndChanged}
          />
        </span>
        <span className={css(styles.flexAllMeasures)}>
          <small className={css(styles.text, styles.light)}>All Measures</small>
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

const ConnectedPopover = connect(null, { changeTempo })(TempoPopover);

class Tempo extends Component {
  constructor() {
    super();

    this.state = { popoverOpen: false };
  }

  onClick = () => {
    if (this.state.popoverOpen) {
      this.onPopoverClose();
    } else {
      this.props.onClick();
      this.setState({ popoverOpen: true });
    }
  };

  onPopoverClose = () => {
    this.setState({ popoverOpen: false });
    this.props.onClose();
  };

  render() {
    const { tempo, color, cursor } = this.props;
    const body = <ConnectedPopover cursor={cursor} tempo={tempo} />;

    return (
      <div>
        <Popover
          preferPlace="right"
          className={css(styles.popover)}
          isOpen={this.state.popoverOpen}
          onOuterAction={this.onPopoverClose}
          body={body}
        >
          <TempoButton onClick={this.onClick} tempo={tempo} color={color} />
        </Popover>
      </div>
    );
  }
}

export default connect(state => ({
  tempo:
    state.tracks.present[state.currentTrackIndex].measures[
      state.cursor.measureIndex
    ].tempo,
  cursor: state.cursor
}))(Tempo);
