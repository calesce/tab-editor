import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

const popoverStyle = {
  position: 'absolute',
  zIndex: 5,
  background: '#FEFBF7',
  marginTop: -200,
  marginLeft: 40,
  borderRadius: 12,
  boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.1)'
};

class Popover extends Component {
  constructor(props) {
    super(props);

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(e) {
    this.props.onClose(e);
  }

  render() {
    return (
      <div style={{ ...popoverStyle, width: this.props.width, height: this.props.height, marginTop: this.props.marginTop }}>
        {this.props.children}
      </div>
    );
  }
}

export default onClickOutside(Popover);
