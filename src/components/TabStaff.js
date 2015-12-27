import React, { Component } from 'react';

import Measure from './Measure';

export default class TabStaff extends Component {
  getXCoordOfMeasure = (rowIndex, totalMeasureIndex) => {
    return this.props.track.reduce((accum, measure, i) => {
      if(measure.rowIndex === rowIndex && i < totalMeasureIndex) {
        return measure.width + accum;
      }
      return accum;
    }, 0);
  }

  getYCoordOfRow = (rowIndex) => {
    return 170 * rowIndex;
  }

  getIndexOfRow = (rowIndex, totalMeasureIndex) => {
    return this.props.track.reduce((accum, measure, i) => {
      if(measure.rowIndex === rowIndex && i < totalMeasureIndex) {
        return accum + 1;
      }
      return accum;
    }, 0);
  }

  renderMeasureForRow = (measure, totalMeasureIndex) => {
    const rowIndex = measure.rowIndex;
    const x = this.getXCoordOfMeasure(rowIndex, totalMeasureIndex);
    const y = this.getYCoordOfRow(rowIndex);
    const indexOfRow = this.getIndexOfRow(rowIndex, totalMeasureIndex);

    return (
      <Measure key={totalMeasureIndex} x={x} y={y}
        measure={measure}
        isPlaying={this.props.isPlaying}
        currentPlayingNote={this.props.currentPlayingNote}
        totalMeasureIndex={totalMeasureIndex}
        currentEditingIndex={this.props.currentEditingIndex}
        onClick={this.props.onClick}
        indexOfRow={indexOfRow}
      />
    );
  }

  calcWidth = (track) => {
    return track.reduce((width, measure) => {
      return measure.width + width;
    }, 20);
  }

  calcHeight = () => {
    const rowCount = this.props.track[this.props.track.length - 1].rowIndex + 1;
    return rowCount * 160 + 50;
  }

  render() {
    let height = this.props.layout === 'linear' ? '100%' : this.calcHeight();
    let width = this.props.layout === 'linear' ? this.calcWidth(this.props.track) : '100%';
    return (
      <svg style={{ width: width, height: height }}>
        { this.props.track.map(this.renderMeasureForRow) }
      </svg>
    );
  }
}
