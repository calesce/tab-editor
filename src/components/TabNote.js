import React, { Component } from 'react';

export default class TabNote extends Component {
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

    let xToRender = x + 1;
    if(fret > 9) {
      xToRender += 4;
    }

    switch(this.props.duration) {
      case 'q':
        return this.renderQuarterStem(xToRender, color);
      case 'e':
        return this.renderEighthStem(xToRender, color);
      case 's':
        return this.renderSixteenthStem(xToRender, color);
      default:
        return null;
    }
  }

  render() {
    const { x, y, fret, color} = this.props;

    let width = 14;
    if(fret > 9) {
      width += 6;
    }

    const style = {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'crosshair'
    };

    return (
      <g>
        <rect x={x} y={y-7} height={5.5} width={width} fill='#ffffff' stroke='#ffffff'></rect>
        <text onClick={this.onClick} x={x+2} y={y} fill={color} style={style}>{fret}</text>
        {this.renderStem()}
      </g>
    );
  }
}
