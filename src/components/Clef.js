import React, { Component } from 'react';

export default class Clef extends Component {
  renderTabClef = () => {
    return (
      <g>
        <text x={10} y={30} fill='#000000'>T</text>
        <text x={10} y={50} fill='#000000'>A</text>
        <text x={10} y={70} fill='#000000'>B</text>
      </g>
    );
  }

  render() {
    return this.renderTabClef();
  }
}
