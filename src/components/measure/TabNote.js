import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

const style = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  cursor: 'crosshair',
  fontSize: 14
};

export default class TabNote extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
    this.renderQuarterStem = this.renderQuarterStem.bind(this);
    this.renderEighthStem = this.renderEighthStem.bind(this);
    this.renderSixteenthStem = this.renderSixteenthStem.bind(this);
    this.renderStem = this.renderStem.bind(this);
    this.renderDot = this.renderDot.bind(this);
    this.renderTremolo = this.renderTremolo.bind(this);
    this.renderVibrato = this.renderVibrato.bind(this);
    this.renderTrill = this.renderTrill.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.noteIndex, this.props.stringIndex);
  }

  renderQuarterStem(x, color, stringOffset) {
    const y = 97 - (13 * stringOffset);
    return <rect x={x + 5} y={y} height={25} width={1} fill={color}></rect>;
  }

  renderEighthStem(x, color, stringOffset) {
    const y = 121 - (13 * stringOffset);
    return (
      <g>
        { this.renderQuarterStem(x, color, stringOffset) }
        <rect x={x + 5} y={y} height={2} width={20} fill={color}></rect>
      </g>
    );
  }

  renderSixteenthStem(x, color, stringOffset) {
    const y = 115 - (13 * stringOffset);
    return (
      <g>
        { this.renderQuarterStem(x, color, stringOffset) }
        { this.renderEighthStem(x, color, stringOffset) }
        <rect x={x + 5} y={y} height={2} width={20} fill={color}></rect>
      </g>
    );
  }

  renderStem() {
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
  }

  renderDot(dotted, x, stringOffset, color) {
    if(!dotted) {
      return null;
    }
    const y = 119 - (13 * stringOffset);

    return (
      <svg x={x} y={y} width={20} height={20}>
        <circle cx={6.5} cy={10} r={1.5} fill={color} stroke={color} />
      </svg>
    );
  }

  renderTremolo(tremolo, x, stringOffset, color) {
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
  }

  renderVibrato(vibrato, x, color) {
    if(!vibrato) {
      return null;
    }

    return (
      <svg x={x + 1.5} y={10}>
        <g transform='scale(8.00, 6.00)'>
          <path fill={color}
             d='M 1.864,0.316 C 1.88,0.292 1.9,0.28 1.928,0.28 c 0.044,0 0.08,0.036 0.08,0.08 0,0.016 -0.004,0.032 -0.012,0.044 C 1.872,0.592 1.748,0.776 1.624,0.964 1.608,0.988 1.584,1 1.556,1 1.532,1 1.512,0.992 1.496,0.972 L 1.104,0.496 0.792,0.964 C 0.776,0.988 0.752,1 0.724,1 0.7,1 0.68,0.992 0.664,0.972 L 0.268,0.496 C 0.228,0.56 0.184,0.62 0.144,0.684 0.128,0.708 0.108,0.72 0.08,0.72 0.036,0.72 0,0.684 0,0.64 0,0.624 0.004,0.608 0.012,0.596 0.136,0.408 0.26,0.224 0.384,0.036 0.4,0.012 0.424,0 0.452,0 0.476,0 0.496,0.008 0.512,0.028 L 0.904,0.504 1.216,0.036 C 1.232,0.012 1.256,0 1.284,0 1.308,0 1.328,0.008 1.344,0.028 L 1.74,0.504 C 1.78,0.44 1.824,0.38 1.864,0.316 Z' />
        </g>
        <g transform='translate(13.0, 0.0)'>
          <g transform='scale(8.00, 6.00)'>
            <path fill={color}
               d='M 1.864,0.316 C 1.88,0.292 1.9,0.28 1.928,0.28 c 0.044,0 0.08,0.036 0.08,0.08 0,0.016 -0.004,0.032 -0.012,0.044 C 1.872,0.592 1.748,0.776 1.624,0.964 1.608,0.988 1.584,1 1.556,1 1.532,1 1.512,0.992 1.496,0.972 L 1.104,0.496 0.792,0.964 C 0.776,0.988 0.752,1 0.724,1 0.7,1 0.68,0.992 0.664,0.972 L 0.268,0.496 C 0.228,0.56 0.184,0.62 0.144,0.684 0.128,0.708 0.108,0.72 0.08,0.72 0.036,0.72 0,0.684 0,0.64 0,0.624 0.004,0.608 0.012,0.596 0.136,0.408 0.26,0.224 0.384,0.036 0.4,0.012 0.424,0 0.452,0 0.476,0 0.496,0.008 0.512,0.028 L 0.904,0.504 1.216,0.036 C 1.232,0.012 1.256,0 1.284,0 1.308,0 1.328,0.008 1.344,0.028 L 1.74,0.504 C 1.78,0.44 1.824,0.38 1.864,0.316 Z' />
          </g>
        </g>
      </svg>
    );
  }

  renderTrill(trill, x, color) {
    if(!trill) {
      return null;
    }

    return (
      <svg x={x + 1.5} y={10}>
        <text y={7} style={{ fontSize: 12 }}>tr</text>
        <g transform='translate(11.0, 0.0)'>
          <g transform='scale(8.00, 6.00)'>
            <path fill={color}
               d='M 1.864,0.316 C 1.88,0.292 1.9,0.28 1.928,0.28 c 0.044,0 0.08,0.036 0.08,0.08 0,0.016 -0.004,0.032 -0.012,0.044 C 1.872,0.592 1.748,0.776 1.624,0.964 1.608,0.988 1.584,1 1.556,1 1.532,1 1.512,0.992 1.496,0.972 L 1.104,0.496 0.792,0.964 C 0.776,0.988 0.752,1 0.724,1 0.7,1 0.68,0.992 0.664,0.972 L 0.268,0.496 C 0.228,0.56 0.184,0.62 0.144,0.684 0.128,0.708 0.108,0.72 0.08,0.72 0.036,0.72 0,0.684 0,0.64 0,0.624 0.004,0.608 0.012,0.596 0.136,0.408 0.26,0.224 0.384,0.036 0.4,0.012 0.424,0 0.452,0 0.476,0 0.496,0.008 0.512,0.028 L 0.904,0.504 1.216,0.036 C 1.232,0.012 1.256,0 1.284,0 1.308,0 1.328,0.008 1.344,0.028 L 1.74,0.504 C 1.78,0.44 1.824,0.38 1.864,0.316 Z' />
          </g>
        </g>
      </svg>
    );
  }

  render() {
    const { x, y, fret, color, stringOffset, displayOption, dotted, tremolo, vibrato, trill } = this.props;

    let width = 12;
    if(fret > 9) {
      width += 6;
    }

    const tabNote = fret !== undefined ?
      <text onClick={this.onClick} x={x+2} y={y} fill={color} style={style}>{fret}</text> :
      null;

    const space = fret !== undefined ?
      <rect x={x} y={y-7} height={5.5} width={width} fill='#ffffff' stroke='#ffffff'></rect> :
      null;

    const clickArea = <rect onClick={this.onClick} x={x-14} y={y-11} height={15} width={45} opacity={0}></rect>;

    return (
      <g>
        {clickArea}
        {space}
        {tabNote}
        {fret !== undefined && displayOption === 'tab' ? this.renderStem() : null}
        {fret !== undefined ? this.renderDot(dotted, x, stringOffset, color) : null}
        {fret !== undefined ? this.renderTremolo(tremolo, x, stringOffset, color): null}
        {fret !== undefined ? this.renderVibrato(vibrato, x, color): null}
        {fret !== undefined ? this.renderTrill(trill, x, stringOffset, color): null}
      </g>
    );
  }
}
