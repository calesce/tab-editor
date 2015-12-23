import React, { Component } from 'react';

import Measure from './Measure';

export default class TabStaff extends Component {
  getXCoordOfMeasure = (row, index) => {
    return row.slice(0, index).reduce((prev, curr) => {
      return prev + curr.width;
    }, 0);
  }

  getYCoordOfRow = (rowIndex) => {
    return 170 * rowIndex;
  }

  getMeasureCountUpToRow = (rowIndex) => {
    return this.props.track.reduce((next, curr, i) => {
      return i < rowIndex ? next + curr.length : next;
    }, 0);
  }

  renderMeasureForRow = (row, measureIndex, rowIndex, y, totalMeasureIndex) => {
    let measure = row[measureIndex];
    let x = this.getXCoordOfMeasure(row, measureIndex);

    return (
      <Measure key={totalMeasureIndex} x={x} y={y}
        measure={measure}
        isPlaying={this.props.isPlaying}
        currentPlayingNote={this.props.currentPlayingNote}
        totalMeasureIndex={totalMeasureIndex}
        currentEditingIndex={this.props.currentEditingIndex}
        onClick={this.props.onClick}
        indexOfRow={measureIndex}
      />
    );
  }

  renderRow = (row, rowIndex) => {
    let y = this.getYCoordOfRow(rowIndex);
    let totalMeasureIndex = this.getMeasureCountUpToRow(rowIndex);

    return row.map((measure, measureIndex) => {
        return this.renderMeasureForRow(row, measureIndex, rowIndex, y, totalMeasureIndex + measureIndex);
    });
  }

  calcWidth = (track) => {
    return track[0].reduce((width, measure) => {
      return measure.width + width;
    }, 20);
  }

  render() {
    let height = this.props.track.length * 160 + 50;
    let width = this.props.track.length === 1 ? this.calcWidth(this.props.track) : '100%';
    return (
      <svg style={{ width: width, height: height }}>
        { this.props.track.map(this.renderRow) }
      </svg>
    );
  }
}
