import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Popover from './Popover';
import { changeBpm } from '../../actions/track';
import hover from './hoverContainer';

const textStyle = {
  fontSize: 12,
  fontWeight: 600,
  fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif'
};

const flexStyle = {
  height: 80,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around'
};

const BpmButton = hover()(({ bpm, style, onClick, color}) => (
  <svg onClick={onClick} width='80' height='50' style={style}>
    <g transform='translate(25, 12)'>
      <g transform='scale(0.5)'>
        <path strokeWidth={0.2} fill={color}
          d='M 11.09297,35.38984 C 14.48881,33.56987 16.29825,30.27529 15.18519,27.79688 C 13.99793,25.15324 9.91818,24.40716 6.07861,26.13151 C 2.23905,27.85587 0.08645,31.40091 1.27371,34.04454 C 2.46098,36.68818 6.54072,37.43426 10.38029,35.70991 C 10.62026,35.60214 10.86657,35.51117 11.09297,34.38984 z '
        />
        <path strokeWidth={1.5} stroke={color} d='M 14.72547,29.05645 L 14.72547,0.46888' />
      </g>
      <g transform='translate(10, 17)'>
        <text fill={color} style={textStyle}>
          ={bpm}
        </text>
      </g>
    </g>
  </svg>
));

class BpmPopover extends Component {
  constructor(props) {
    super(props);

    this.onClose = this.onClose.bind(this);
    this.onTextChanged = this.onTextChanged.bind(this);
    this.toEndChanged = this.toEndChanged.bind(this);
    this.allChanged = this.allChanged.bind(this);

    this.state = {
      bpm: props.bpm,
      toEndChecked: false,
      allChecked: false
    };
  }

  onClose(e) {
    this.props.onClose(e, this.state.bpm, this.state.toEndChecked, this.state.allChecked);
  }

  onTextChanged(e) {
    if(!isNaN(parseInt(e.target.value)) || e.target.value === '') {
      this.setState({ bpm: e.target.value });
    }
  }

  toEndChanged() {
    this.setState({ toEndChecked: !this.state.toEndChecked });
  }

  allChanged() {
    this.setState({ allChecked: !this.state.allChecked });
  }

  render() {
    return (
      <Popover onClose={this.onClose} height={80} width={100} marginTop={-90}>
        <div style={flexStyle}>
          <input style={{ marginTop: 5, marginLeft: 15, marginRight: 15 }} type='text' value={this.state.bpm} onChange={this.onTextChanged} />
          <span style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 12 }}>
            <small style={{ textStyle, fontWeight: 300, fontSize: 12, paddingTop: 3 }}>To End</small>
            <input type='checkbox' value={this.state.toEndChecked} onChange={this.toEndChanged} />
          </span>
          <span style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 12 }}>
            <small style={{ textStyle, fontWeight: 300, fontSize: 12, paddingTop: 3 }}>All Measures</small>
            <input type='checkbox' value={this.state.allChecked} onChange={this.allChanged} />
          </span>
        </div>
      </Popover>
    );
  }
}

class Bpm extends Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
    this.onPopoverClose = this.onPopoverClose.bind(this);
  }

  onClick(event) {
    if(!this.props.popoverOpen) {
      if(!this.event || event.target !== this.event.target) {
        this.props.onClick();
      }
      this.event = null;
    }
  }

  onPopoverClose(event, bpm, toEndChecked, allChecked) {
    this.event = event;
    if(bpm !== this.props.bpm && bpm !== '') {
      this.props.changeBpm(this.props.cursor, bpm, toEndChecked, allChecked);
    }
    this.props.onClose();
  }

  render() {
    const { bpm, style, color } = this.props;

    return (
      <div>
        <BpmButton onClick={this.onClick} bpm={bpm} style={style} color={color} />
        { this.props.popoverOpen ?
          <BpmPopover checked={true} bpm={bpm} onClose={this.onPopoverClose} />
          : null }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    bpm: state.tracks.present[state.currentTrackIndex].measures[state.cursor.measureIndex].bpm,
    cursor: state.cursor
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeBpm: bindActionCreators(changeBpm, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bpm);
