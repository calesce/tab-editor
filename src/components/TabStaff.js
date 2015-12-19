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
    return this.props.song.reduce((next, curr, i) => {
      if(i < rowIndex) {
        return next + curr.length;
      } else {
        return next;
      }
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

  calcWidth = (song) => {
    return song[0].reduce((width, measure) => {
      return measure.width + width;
    }, 20);
  }

  render() {
    let height = this.props.song.length * 160 + 50;
    let width = this.props.song.length === 1 ? this.calcWidth(this.props.song) : '100%';
    return (
      <svg style={{ width: width, height: height }}>
        { this.props.song.map(this.renderRow) }
      </svg>
    );
  }
}
