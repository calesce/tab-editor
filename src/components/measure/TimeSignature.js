import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class TimeSignature extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  renderCommonTimeSignature = () => {
    return (
      <svg x={this.props.x} y={30}>
        <path d='M11 17.2L11.6 17.2C12.7 17.2 13.7 17.4 14.7 17.9 15.6 18.4 16.5 19.1 17.1 19.9 17 19.9 16.9 19.9 16.8 19.9 16.7 19.9 16.6 19.9 16.5 19.9 15.4 19.9 14.6 20.3 14 21 13.4 21.7 13.1 22.5 13.1 23.4 13.2 24.7 13.6 25.6 14.4 26.1 15.2 26.7 15.9 26.9 16.6 26.9L16.6 26.9C17.5 26.9 18.2 26.6 18.8 25.9 19.4 25.3 19.7 24.5 19.7 23.6 19.7 22.7 19.4 21.6 18.8 20.5 18.2 19.3 17.3 18.3 16.1 17.4 14.9 16.5 13.4 16.1 11.6 16L11 16 9.2 16.2C5.9 16.8 3.5 18.2 2.1 20.4 0.6 22.6-0.1 25.2 0 28.2 -0.1 31.1 0.6 33.7 2.1 35.9 3.5 38.2 5.9 39.6 9.2 40.2L11 40.3C11.1 40.3 11.2 40.3 11.3 40.3 11.4 40.3 11.5 40.4 11.6 40.4 13.6 40.3 15.3 39.6 16.5 38.5 17.8 37.3 18.7 36.1 19.2 34.8 19.8 33.5 20 32.7 20 32.3 20 32.1 20 32 19.8 31.9 19.7 31.8 19.6 31.7 19.4 31.7 19.3 31.7 19.2 31.8 19.1 31.8 19 31.9 18.9 32 18.9 32.2 18.4 34.1 17.6 35.8 16.3 37.1 15 38.4 13.4 39.1 11.6 39.2 11.5 39.2 11.4 39.2 11.3 39.2 11.2 39.2 11.1 39.1 10.1 39 7.9 38.3 7.1 37.3 6.8 35.9 6.4 34.4 6.3 32.7 6.3 30.5L6.3 28.2 6.3 25.8C6.3 23.7 6.4 21.9 6.8 20.4 7.1 19 7.9 18 9.2 17.5' />
      </svg>
    );
  }

  renderCutTimeSignature = () => {
    return (
      <svg x={this.props.x} y={30}>
        <rect x={10} y={17} height={32} width={2}></rect>
        <path d='M11 17.2L11.6 17.2C12.7 17.2 13.7 17.4 14.7 17.9 15.6 18.4 16.5 19.1 17.1 19.9 17 19.9 16.9 19.9 16.8 19.9 16.7 19.9 16.6 19.9 16.5 19.9 15.4 19.9 14.6 20.3 14 21 13.4 21.7 13.1 22.5 13.1 23.4 13.2 24.7 13.6 25.6 14.4 26.1 15.2 26.7 15.9 26.9 16.6 26.9L16.6 26.9C17.5 26.9 18.2 26.6 18.8 25.9 19.4 25.3 19.7 24.5 19.7 23.6 19.7 22.7 19.4 21.6 18.8 20.5 18.2 19.3 17.3 18.3 16.1 17.4 14.9 16.5 13.4 16.1 11.6 16L11 16 9.2 16.2C5.9 16.8 3.5 18.2 2.1 20.4 0.6 22.6-0.1 25.2 0 28.2 -0.1 31.1 0.6 33.7 2.1 35.9 3.5 38.2 5.9 39.6 9.2 40.2L11 40.3C11.1 40.3 11.2 40.3 11.3 40.3 11.4 40.3 11.5 40.4 11.6 40.4 13.6 40.3 15.3 39.6 16.5 38.5 17.8 37.3 18.7 36.1 19.2 34.8 19.8 33.5 20 32.7 20 32.3 20 32.1 20 32 19.8 31.9 19.7 31.8 19.6 31.7 19.4 31.7 19.3 31.7 19.2 31.8 19.1 31.8 19 31.9 18.9 32 18.9 32.2 18.4 34.1 17.6 35.8 16.3 37.1 15 38.4 13.4 39.1 11.6 39.2 11.5 39.2 11.4 39.2 11.3 39.2 11.2 39.2 11.1 39.1 10.1 39 7.9 38.3 7.1 37.3 6.8 35.9 6.4 34.4 6.3 32.7 6.3 30.5L6.3 28.2 6.3 25.8C6.3 23.7 6.4 21.9 6.8 20.4 7.1 19 7.9 18 9.2 17.5' />
      </svg>
    );
  }

  renderNumberedTimeSignature = (numerator, denominator) => {
    return (
      <svg x={this.props.x} y={30}>
        <text x={0} y={26} fill='#000000' fontFamily='Georgia' fontWeight={900} fontSize={27}>{numerator}</text>
        <text x={0} y={56} fill='#000000' fontFamily='Georgia' fontWeight={900} fontSize={27}>{denominator}</text>
      </svg>
    );
  }

  render() {
    let { numerator, denominator } = this.props;

    if(numerator === '4' && denominator === '4') {
      return this.renderCommonTimeSignature();
    } else if(numerator === '4' && denominator === '4') {
      return this.renderCutTimeSignature();
    } else {
      return this.renderNumberedTimeSignature(this.props.numerator, this.props.denominator);
    }
  }
}