import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reverse, last } from 'lodash';
import Popover from 'react-popover-fork';

import hover from './hoverContainer';
import { changeTuning } from '../../actions/track';
import { nextNote, previousNote, previousOctave, nextOctave } from '../../util/midiNotes';

/*const textStyle = {
  fontSize: 10,
  fontWeight: 700,
  fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif'
};*/

const popoverStyle = {
  zIndex: 5,
  fill: '#FEFBF7',
  marginLeft: 0
};

const flexStyle = {
  background: '#FEFBF7',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const textInputStyle = {
  fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif',
  marginTop: 5, marginBottom: 5, marginLeft: 15, marginRight: 15, width: 70
};

const TuningIcon = hover()(({ style, onClick, color}) => (
  <svg onClick={onClick} width={40} height={50} style={style}>
    <path fill={color} d='M4.416 21.77c-1.058 0-1.916.858-1.916 1.916v3.704c0 1.058.858 1.917 1.916 1.917 1.058 0 1.916-.858 1.916-1.917v-.468h2.652v1.906c0 .575.367 1.328.82 1.683l5.355 4.185v7.07h9.42v-7.16l5.347-4.102c.457-.35.827-1.1.827-1.675v-1.906h2.65v.468c0 1.058.86 1.917 1.918 1.917 1.058 0 1.916-.858 1.916-1.917v-3.704c0-1.058-.858-1.916-1.916-1.916-1.058 0-1.917.858-1.917 1.916v.57h-2.65v-8.52h2.65v.568c0 1.058.86 1.917 1.917 1.917 1.058 0 1.916-.857 1.916-1.916V12.6c0-1.058-.858-1.916-1.916-1.916-1.058 0-1.917.858-1.917 1.916v.47h-2.65V8.678c0-.575-.43-.855-.955-.624l-9.01 3.945c-.528.23-1.383.23-1.91-.002l-8.943-3.94c-.527-.233-.953.046-.953.62v4.395H6.332v-.47c0-1.058-.858-1.916-1.916-1.916-1.058 0-1.916.858-1.916 1.916v3.705c0 1.058.858 1.916 1.916 1.916 1.058 0 1.916-.857 1.916-1.915v-.57h2.652v8.523H6.332v-.572c0-1.058-.858-1.916-1.916-1.916z' />
  </svg>
));

class TuningStringInput extends Component {
  constructor() {
    super();

    this.onTextChanged = this.onTextChanged.bind(this);
  }

  midiStringFromKeyCode(string, keyCode, shiftKey) {
    switch(keyCode) {
      case 37:
        return previousNote(string);
      case 38:
        return nextOctave(string);
      case 39:
        return nextNote(string);
      case 40:
        return previousOctave(string);
      default: {
        if(keyCode === 51 && shiftKey) {
          if(string[0] !== 'e' && string[0] !== 'b' && string.length === 2) {
            return string[0] + '#' + string[1];
          }
        } else if(keyCode >= 48 && keyCode <= 57) {
          return string[0] + (keyCode - 48);
        } else if(keyCode >= 65 && keyCode <= 71) {
          return String.fromCharCode(keyCode).toLowerCase() + last(string.split(''));
        }
        return string;
      }
    }
  }

  onTextChanged(e) {
    const newString = this.midiStringFromKeyCode(this.props.string, e.keyCode, e.shiftKey);
    if(newString !== this.props.string) {
      this.props.onChange(newString, this.props.index);
    }
  }

  noop() { /* this exists to make React happy */ }

  render() {
    return <input style={textInputStyle} type='text' tabindex='1' size={2} value={this.props.string}
      onChange={this.noop} onKeyDown={this.onTextChanged} />;
  }
}

class TuningPopover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tuning: [].concat(props.tuning)
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillUnmount() {
    this.props.changeTuning(reverse(this.state.tuning));
  }

  onChange(newString, i) {
    const { tuning } = this.state;
    const newTuning = tuning.slice(0, i).concat(newString).concat(tuning.slice(i + 1, tuning.length));
    this.setState({ tuning: reverse(newTuning) });
  }

  render() {
    const tuningInputs = reverse(this.state.tuning).map((string, i) => (
      <TuningStringInput string={string} index={i} key={i} onChange={this.onChange} />
    ));

    return (
        <form style={flexStyle}>
          {tuningInputs}
        </form>
    );
  }
}
const ConnectedPopover = connect(null, { changeTuning })(TuningPopover);

class TuningButton extends Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
    this.onPopoverClose = this.onPopoverClose.bind(this);

    this.state = {
      popoverOpen: false
    };
  }

  onClick() {
    if(this.state.popoverOpen) {
      this.onPopoverClose();
    } else {
      this.props.onClick();
      this.setState({ popoverOpen: true });
    }
  }

  onPopoverClose() {
    this.setState({ popoverOpen: false });
    this.props.onClose();
  }

  render() {
    const { style, color, tuning } = this.props;
    const body = <ConnectedPopover tuning={tuning}  />;

    return (
      <div>
        <Popover preferPlace='right' style={popoverStyle} isOpen={this.state.popoverOpen}
          onOuterAction={this.onPopoverClose} body={body}>
          <TuningIcon onClick={this.onClick} style={style} color={color} />
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = state => ({ tuning: state.tracks.present[state.currentTrackIndex].tuning });

export default connect(mapStateToProps)(TuningButton);
