import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Clef extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  renderTabClef() {
    const style = {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'default'
    };

    const { strings, y } = this.props;
    const baseY = strings * (3 + 1 / 3) + y; // start closer to top for lower number of strings
    const interval = strings * 4 - 4; // more spaced out for more strings
    const fontSize = strings * 2 + 6; // the more strings, the larger the font default 18

    return (
      <g>
        <text x={10} y={baseY} style={style} fill='#000000' fontSize={fontSize}>T</text>
        <text x={10} y={baseY + interval} style={style} fill='#000000' fontSize={fontSize}>A</text>
        <text x={10} y={baseY + (2 * interval)} style={style} fill='#000000' fontSize={fontSize}>B</text>
      </g>
    );
  }

  render() {
    return this.renderTabClef();
  }
}
