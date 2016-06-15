import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { changeTimeSignature } from '../../actions/track';
import { timeSignatureSelector } from '../../util/selectors';

import TimeSignaturePopover from './TimeSignaturePopover';
import hover from './hoverContainer';

const textStyle = {
  fontSize: 17,
  fontWeight: 600,
  fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif'
};

const TimeSignatureButton = hover()(({ timeSignature, style, onClick, color}) => (
  <svg onClick={onClick} width='40' height='50' style={style}>
    <g transform='translate(6, 30)'>
      <text fill={color} style={textStyle}>
        {`${timeSignature.beats}/${timeSignature.beatType}`}
      </text>
    </g>
  </svg>
));

class TimeSignature extends Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
    this.onPopoverClose = this.onPopoverClose.bind(this);
    this.setPopoverRef = this.setPopoverRef.bind(this);

    this.state = {
      popoverOpen: false
    };
  }

  onClick() {
    if(!this.state.popoverOpen) {
      this.setState({ popoverOpen: true });
    }
  }

  onPopoverClose(timeSignature, toEndChecked, allChecked) {
    if(timeSignature.beats !== this.props.timeSignature.beats || timeSignature.beatType !== this.props.timeSignature.beatType) {
      this.props.changeTimeSignature({ measureIndex: this.props.measureIndex }, timeSignature, toEndChecked, allChecked);
    }
    this.setState({ popoverOpen: false });
  }

  setPopoverRef(ref) {
    this._popover = ref;
  }

  render() {
    const { timeSignature, style, color } = this.props;

    return (
      <div>
        <TimeSignatureButton onClick={this.onClick} timeSignature={timeSignature} style={style} color={color} />
        { this.state.popoverOpen ?
          <TimeSignaturePopover checked={true} timeSignature={timeSignature} onClose={this.onPopoverClose} />
          : null }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    timeSignature: timeSignatureSelector(state),
    measureIndex: state.present.cursor.measureIndex
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeTimeSignature: bindActionCreators(changeTimeSignature, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeSignature);
