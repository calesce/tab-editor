import React, { Component } from 'react';

export default class Clef extends Component {
  renderTabClef = () => {
    let style = {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'default'
    };

    return (
      <g>
        <text x={10} y={30} style={style} fill='#000000'>T</text>
        <text x={10} y={50} style={style} fill='#000000'>A</text>
        <text x={10} y={70} style={style} fill='#000000'>B</text>
      </g>
    );
  }

  render() {
    return this.renderTabClef();
  }
}
