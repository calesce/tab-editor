import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TabNote extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  onClick = () => {
    this.props.onClick();
  };

  renderQuarterStem = (x, color, stringOffset) => {
    const y = 97 - (13 * stringOffset);
    return <rect x={x + 5} y={y} height={25} width={1} fill={color}></rect>;
  };

  renderEighthStem = (x, color, stringOffset) => {
    const y = 121 - (13 * stringOffset);
    return (
      <g>
        { this.renderQuarterStem(x, color, stringOffset) }
        <rect x={x + 5} y={y} height={2} width={20} fill={color}></rect>
      </g>
    );
  };

  renderSixteenthStem = (x, color, stringOffset) => {
    const y = 115 - (13 * stringOffset);
    return (
      <g>
        { this.renderQuarterStem(x, color, stringOffset) }
        { this.renderEighthStem(x, color, stringOffset) }
        <rect x={x + 5} y={y} height={2} width={20} fill={color}></rect>
      </g>
    );
  };

  renderStem = () => {
    const { x, color, stringOffset } = this.props;

    switch(this.props.duration) {
      case 'q':
        return this.renderQuarterStem(x + 1, color, stringOffset);
      case 'e':
        return this.renderEighthStem(x + 1, color, stringOffset);
      case 's':
        return this.renderSixteenthStem(x + 1, color, stringOffset);
      default:
        return null;
    }
  };

  renderDot = (dotted, x, stringOffset, color) => {
    if(!dotted) {
      return null;
    }
    const y = 119 - (13 * stringOffset);

    return (
      <svg x={x} y={y} width={20} height={20}>
        <circle cx={6.5} cy={10} r={1.5} fill={color} stroke={color} />
      </svg>
    );
  };

  renderTremolo = (tremolo, x, stringOffset, color) => {
    if(!tremolo) {
      return null;
    }
    const y = 100 - (13 * stringOffset);

    return (
      <svg x={x + 1.5} y={y} >
        <g transform='scale(0.30)'>
          <polygon fill={color} points='31.5,7 3.75,21.25 3.75,14.5 31.5,0.25'/>
          <polygon fill={color} points='31.5,19.25 3.75,33.5 3.75,26.75 31.5,12.5'/>
          <polygon fill={color} points='31.5,31.5 3.75,45.75 3.75,39 31.5,24.75'/>
        </g>
      </svg>
    );
  };

  render() {
    const { x, y, fret, color, dotted, tremolo, stringOffset } = this.props;

    let width = 12;
    if(fret > 9) {
      width += 6;
    }

    const style = {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'crosshair',
      fontSize: 14
    };

    const note = fret !== undefined ?
      <text onClick={this.onClick} x={x+2} y={y} fill={color} style={style}>{fret}</text> :
      null;

    const space = fret !== undefined ?
      <rect x={x} y={y-7} height={5.5} width={width} fill='#ffffff' stroke='#ffffff'></rect> :
      <rect onClick={this.onClick} x={x-14} y={y-11} height={15} width={45} opacity={0}></rect>;

    return (
      <g>
        {space}
        {note}
        {fret !== undefined ? this.renderStem() : null}
        {fret !== undefined ? this.renderDot(dotted, x, stringOffset, color) : null}
        {fret !== undefined ? this.renderTremolo(tremolo, x, stringOffset, color): null}
      </g>
    );
  }
}
