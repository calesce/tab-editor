import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TabNote extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  onClick = () => {
    this.props.onClick();
  }

  renderQuarterStem = (x, color) => {
    return <rect x={x + 5} y={82} height={25} width={1} fill={color}></rect>;
  }

  renderEighthStem = (x, color) => {
    return (
      <g>
        { this.renderQuarterStem(x, color) }
        <rect x={x + 5} y={82 + 24} height={2} width={20} fill={color}></rect>
      </g>
    );
  }

  renderSixteenthStem = (x, color) => {
    return (
      <g>
        { this.renderQuarterStem(x, color) }
        { this.renderEighthStem(x, color) }
        <rect x={x + 5} y={82 + 18} height={2} width={20} fill={color}></rect>
      </g>
    );
  }

  renderStem = () => {
    const { x, color, fret } = this.props;

    switch(this.props.duration) {
      case 'q':
        return this.renderQuarterStem(x + 1, color);
      case 'e':
        return this.renderEighthStem(x + 1, color);
      case 's':
        return this.renderSixteenthStem(x + 1, color);
      default:
        return null;
    }
  }

  renderDot = (dotted, x, color) => {
    if(!dotted) {
      return null;
    }

    return (
      <svg x={x} y={105} width={20} height={20}>
        <circle cx={6.5} cy={10} r={1.5} fill={color} stroke={color} />
      </svg>
    );
  }

  render() {
    const { x, y, fret, color, dotted } = this.props;

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

    return (
      <g>
        <rect x={x} y={y-7} height={5.5} width={width} fill='#ffffff' stroke='#ffffff'></rect>
        <text onClick={this.onClick} x={x+2} y={y} fill={color} style={style}>{fret}</text>
        {this.renderStem()}
        {this.renderDot(dotted, x, color)}
      </g>
    );
  }
}
