import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import TabNote from './TabNote';
import Rest from '../svg/rest';

export default class TabStaff extends Component {
  renderBars = (x, measureLength) => {
    return (
      <g>
        <rect x={x} y='10' width={measureLength} height='0.5' rx='0' ry='0' fill='#999999' stroke='#999999' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={x} y='23' width={measureLength} height='0.5' rx='0' ry='0' fill='#999999' stroke='#999999' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={x} y='36' width={measureLength} height='0.5' rx='0' ry='0' fill='#999999' stroke='#999999' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={x} y='49' width={measureLength} height='0.5' rx='0' ry='0' fill='#999999' stroke='#999999' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={x} y='62' width={measureLength} height='0.5' rx='0' ry='0' fill='#999999' stroke='#999999' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={x} y='75' width={measureLength} height='0.5' rx='0' ry='0' fill='#999999' stroke='#999999' strokeWidth='0.1' font='10pt Arial'></rect>

        <rect x={x} y='10' width='0.5' height='65' rx='0' ry='0' fill='#999999' stroke='#999999' strokeWidth='0.1' font='10pt Arial'></rect>
        <rect x={x + measureLength} y='10' width='0.5' height='65' rx='0' ry='0' fill='#999999' stroke='#999999' strokeWidth='0.1' font='10pt Arial'></rect>
      </g>
    );
  }

  renderMeasure = (measureIndex, measureLength, measure, x) => {
    return (
      <g>
        { this.renderBars(x, measureLength) }
        {
          measure.notes.map((note, noteIndex) => this.renderNote(note, measureIndex, noteIndex, measureLength, x))
        }
      </g>
    );
  }

  renderNote = (note, measureIndex, index, measureLength, xOfMeasure) => {
    let x = xOfMeasure + (index * 55 + 40);
    let { currentNote, isPlaying } = this.props;

    let color = 'black';
    if(currentNote.measure === measureIndex && currentNote.noteIndex === index && isPlaying) {
      color = '#f9423a';
    }

    if(note.string[0] === 'rest') {
      return <Rest key={index} color={color} x={x} y={0} />;
    }

    return note.string.map((bleh, j) => {
      let y = 80 - (13 * note.string[j]);

      return <TabNote key={j} x={x} y={y} color={color} fret={note.fret[j]} />;
    });
  }

  convertSongIntoRows = (song) => {
    const screenWidth = window.innerWidth;

    return song.reduce((rows, measure, index) => {
      let notes = measure.notes.length;

      let currentRow = rows[rows.length - 1];
      let currentRowWidth = currentRow.reduce((next, curr) => {
        return next + (60 * curr.notes.length);
      }, 0);

      let returnedRows = rows;
      if(currentRowWidth + (60 * measure.notes.length) > screenWidth - 20) {
        if(index !== song.length - 1) {
          returnedRows.push([measure]);
        }
      } else {
        let nextRow = currentRow.concat(measure);

        returnedRows[rows.length - 1] = nextRow;
      }

      return returnedRows;
    }, [[]]);
  }

  getXCoordOfMeasure = (row, index) => {
    if(index === 0) {
      return 0;
    }
    let precedingMeasures = row.slice(0, index);
    return precedingMeasures.reduce((next, curr) => {
      return next + (60 * curr.notes.length);
    }, 0);
  }

  getYCoordOfRow = (rowIndex) => {
    return 170 * rowIndex;
  }

  getMeasureCountUpToRow = (rowIndex) => {
    let rows = this.convertSongIntoRows(this.props.song);

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
    let measureLength = 60 * measure.notes.length;
    let x = this.getXCoordOfMeasure(row, measureIndex);

    return (
      <svg key={measureIndex} x={0} y={y} style={{ height: 250, width: measureLength }}>
        { this.renderMeasure(totalMeasureIndex, measureLength, measure, x) }
      </svg>
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
    let rows = this.convertSongIntoRows(this.props.song);

    return (
      <svg style={{ width: '100%', height: '100%' }}>
        { rows.map(this.renderRow) }
      </svg>
    );
  }
}
