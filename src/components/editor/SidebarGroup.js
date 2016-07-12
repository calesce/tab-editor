import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

const groupStyle = {
  width: '100%'
};

const headerStyle = {
  paddingLeft: '8px',
  color: '#1c2f2f', // darkslategrey slightly darkened
  fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif',
  fontSize: '0.9em',
  textTransform: 'uppercase',
  textShadow: '0.5px 0 0 rgba(0, 0, 0, 0.4)'
};

const flexStyle = {
  marginLeft: 5,
  display: 'flex',
  justifyContent: 'flex-start',
  flexWrap: 'wrap'
};

class SidebarGroup extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <div style={groupStyle}>
        <h3 style={headerStyle}>{this.props.title}</h3>
        <div style={flexStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default SidebarGroup;
