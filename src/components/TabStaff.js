import React, { Component } from 'react';

import Measure from './Measure';

export default class TabStaff extends Component {
  convertSongIntoRows = (song) => {
    return song.reduce((rows, measure, index) => {
      let currentRow = rows[rows.length - 1];
      let currentRowWidth = currentRow.reduce((next, curr) => {
        return next + curr.width;
      }, 0);

      let returnedRows = rows;
      if(currentRowWidth + (60 * measure.notes.length) > window.innerWidth - 20) {
        if(index !== song.length - 1) {
          returnedRows.push([measure]);
        }
      } else {
        returnedRows[rows.length - 1] = currentRow.concat(measure);
      }

      return returnedRows;
    }, [[]]);
  }

  getXCoordOfMeasure = (row, index) => {
    return row.slice(0, index).reduce((prev, curr) => {
      return prev + curr.width;
    }, 0);
  }

  getYCoordOfRow = (rowIndex) => {
    return 170 * rowIndex;
  }

  computeMeasureWidths = (song) => {
    return song.map((measure, index) => {
      let width = 60 * measure.notes.length;
      if(index === 0) {
        width += 15;
      }
      if(measure.notes.length === 0) {
        width = 40;
      }

      let prevMeasure = song[index-1];
      if(prevMeasure && prevMeasure.timeSignature === measure.timeSignature) {
        return {
          notes: measure.notes,
          width
        };
      }
      width += 20;

      return {
        ...measure,
        width
      };
    });
  }

  getMeasureCountUpToRow = (rowIndex) => {
    let measuresWithWidths = this.computeMeasureWidths(this.props.song);
    let rows = this.convertSongIntoRows(measuresWithWidths);

    return rows.reduce((next, curr, i) => {
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

  render() {
    let measuresWithWidths = this.computeMeasureWidths(this.props.song);
    let rows = this.convertSongIntoRows(measuresWithWidths);

    return (
      <svg style={{ width: '100%', height: '100%' }}>
        { rows.map(this.renderRow) }
      </svg>
    );
  }
}
