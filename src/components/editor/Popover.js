import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

const popoverStyle = {
  position: 'absolute',
  zIndex: 5,
  background: '#FEFBF7',
  marginLeft: 40,
  borderRadius: 12,
  boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.1)'
};

class Popover extends Component {
  constructor(props) {
    super(props);

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  componentDidMount() {
    const middleY = (this.childNode.clientHeight / 2);
    this.marginTop = 0 - middleY;
    this.forceUpdate();
  }

  handleClickOutside(e) {
    this.props.onClose(e);
  }

  setRef(el) {
    this.childNode = el;
  }

  render() {
    return (
      <div style={{ ...popoverStyle, marginTop: this.marginTop }}>
        { React.cloneElement(this.props.children, { ref: this.setRef }) }
      </div>
    );
  }
}

export default onClickOutside(Popover);
