import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

import hover from './hoverContainer';

const textStyle = {
  fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif'
};

const popoverStyle = {
  position: 'absolute',
  zIndex: 5,
  background: '#FEFBF7',
  width: 160,
  height: 200,
  marginTop: -200,
  marginLeft: 40,
  borderRadius: 12,
  boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.1)',
  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
};

const HoverableText = hover()(({ text, color, style, onClick }) => (
  <span onClick={onClick} style={{ ...style, ...textStyle, color, fontSize: 20, fontWeight: 500 }}>
    { text }
  </span>
));

class Popover extends Component {
  constructor(props) {
    super(props);

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setPopoverRef = this.setPopoverRef.bind(this);
    this.onTwoFourClick = this.onTwoFourClick.bind(this);
    this.onFourFourClick = this.onFourFourClick.bind(this);
    this.onSixEightClick = this.onSixEightClick.bind(this);
    this.onIncrementBeats = this.onIncrementBeats.bind(this);
    this.onIncrementBeatType = this.onIncrementBeatType.bind(this);
    this.onDecrementBeats = this.onDecrementBeats.bind(this);
    this.onDecrementBeatType = this.onDecrementBeatType.bind(this);
    this.toEndChanged = this.toEndChanged.bind(this);
    this.allChanged = this.allChanged.bind(this);

    this.state = {
      timeSignature: Object.assign({}, props.timeSignature),
      toEndChecked: false,
      allChecked: false
    };
  }

  componentDidMount() {
    global.document.addEventListener('click', this.onOutsideClick);
  }

  componentWillUnmount() {
    global.document.removeEventListener('click', this.onOutsideClick);
  }

  handleClickOutside() {
    this.props.onClose(this.state.timeSignature, this.state.toEndChecked, this.state.allChecked);
  }

  onTwoFourClick() {
    // TODO extract these things into a component
    this.setState({
      timeSignature: { beats: 2, beatType: 4 }
    });
  }

  onFourFourClick() {
    this.setState({
      timeSignature: { beats: 4, beatType: 4 }
    });
  }

  onSixEightClick() {
    this.setState({
      timeSignature: { beats: 6, beatType: 8 }
    });
  }

  onIncrementBeats() {
    if(this.state.timeSignature.beats < 32) {
      this.setState({
        timeSignature: { beats: this.state.timeSignature.beats + 1, beatType: this.state.timeSignature.beatType }
      });
    }
  }

  onIncrementBeatType() {
    if(this.state.timeSignature.beatType < 32) {
      this.setState({
        timeSignature: { beats: this.state.timeSignature.beats, beatType: this.state.timeSignature.beatType * 2 }
      });
    }
  }

  onDecrementBeats() {
    if(this.state.timeSignature.beats > 1) {
      this.setState({
        timeSignature: { beats: this.state.timeSignature.beats - 1, beatType: this.state.timeSignature.beatType }
      });
    }
  }

  onDecrementBeatType() {
    if(this.state.timeSignature.beatType > 1) {
      this.setState({
        timeSignature: { beats: this.state.timeSignature.beats, beatType: this.state.timeSignature.beatType / 2 }
      });
    }
  }

  toEndChanged() {
    this.setState({ toEndChecked: !this.state.toEndChecked });
  }

  allChanged() {
    this.setState({ allChecked: !this.state.allChecked });
  }

  setPopoverRef(ref) {
    this._popover = ref;
  }

  render() {
    return (
      <div style={popoverStyle} ref={this.setPopoverRef}>
        <span style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 10 }}>
          <HoverableText onClick={this.onTwoFourClick} text='2/4'/>
          <HoverableText onClick={this.onFourFourClick} text='4/4'/>
          <HoverableText onClick={this.onSixEightClick} text='6/8'/>
        </span>
        <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 10 }}>
          <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 15, alignItems: 'flex-end', flexBasis: '55%' }}>
            <h3 style={{ ...textStyle, fontSize: 40, paddingRight: 10 }}>{this.state.timeSignature.beats}</h3>
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 15, flexBasis: '45%' }}>
            <HoverableText onClick={this.onIncrementBeats} text='&#9650;'/>
            <HoverableText onClick={this.onDecrementBeats} text='&#9660;'/>
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 10 }}>
          <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 15, alignItems: 'flex-end', flexBasis: '55%' }}>
            <h3 style={{ ...textStyle, fontSize: 40, paddingRight: 10 }}>{this.state.timeSignature.beatType}</h3>
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 15, flexBasis: '45%' }}>
            <HoverableText onClick={this.onIncrementBeatType} text='&#9650;'/>
            <HoverableText onClick={this.onDecrementBeatType} text='&#9660;'/>
          </span>
        </div>
        <span style={{ display: 'flex', justifyContent: 'space-around', paddingBottom: 10, paddingLeft: 5, paddingRight: 5 }}>
          <small style={{ ...textStyle, fontWeight: 300, fontSize: 12, paddingTop: 3 }}>To End</small>
          <input type='checkbox' value={this.state.toEndChecked} onChange={this.toEndChanged} />
          <small style={{ ...textStyle, fontWeight: 300, fontSize: 12, paddingTop: 3 }}>All Measures</small>
          <input type='checkbox' value={this.state.allChecked} onChange={this.allChanged} />
        </span>
      </div>
    );
  }
}

export default onClickOutside(Popover);
