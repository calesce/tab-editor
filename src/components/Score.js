import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setSelectRange } from '../actions/cursor';
import { scoreSelector } from '../util/selectors';

import Measure from './measure/Measure';
import SelectBox from './SelectBox';

const SVG_TOP = 50;
const NOTE_WIDTH = 10;
// Give some room for user error when selecting a range of notes
const SELECT_ERROR = 3;

const style = {
  top: 0,
  marginLeft: 5,
  display: 'flex',
  flexWrap: 'wrap',
  flex: 1
};

class Score extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);

    this.state = {
      dragStart: undefined,
      dragEnd: undefined
    };
  }

  getNoteRangeForMeasure = (measure, xStart, xEnd) => {
    const notes = measure.notes.map((note, i) => {
      const noteX = note.x + measure.xOfMeasure;
      return noteX + SELECT_ERROR - NOTE_WIDTH > xStart && noteX - SELECT_ERROR < xEnd ? i : null;
    });
    return notes.filter(note => note !== null);
  };

  getSelectedRangeForSingleRow = (measure, xStart, xEnd) => {
    if(xStart > measure.xOfMeasure && xEnd < measure.xOfMeasure + measure.width) {
      return this.getNoteRangeForMeasure(measure, xStart, xEnd);
    } else if((xStart < measure.xOfMeasure && xEnd > measure.xOfMeasure) ||
       (xStart > measure.xOfMeasure && xStart < measure.xOfMeasure + measure.width)) {

      if(measure.xOfMeasure < xStart) {
        return this.getNoteRangeForMeasure(measure, xStart, measure.xOfMeasure + measure.width);
      } else if(xEnd < measure.xOfMeasure + measure.width) {
        return this.getNoteRangeForMeasure(measure, measure.xOfMeasure, xEnd);
      } else {
        return 'all';
      }
    } else {
      return undefined;
    }
  };

  getSelectedRange = (measure, xStart, xEnd, selectedRows) => {
    if(!selectedRows) {
      return undefined;
    }
    const selectedRowIndex = selectedRows.indexOf(measure.rowIndex);
    if(selectedRowIndex === -1) {
      return undefined;
    }

    if(selectedRows.length === 1) {
      return this.getSelectedRangeForSingleRow(measure, xStart, xEnd);
    } else if(selectedRowIndex === 0) {
      if(measure.xOfMeasure + measure.width > xStart) {
        if(measure.xOfMeasure < xStart) { // starting measure, need note index
          return this.getNoteRangeForMeasure(measure, xStart, measure.xOfMeasure + measure.width);
        } else {
          return 'all';
        }
      }
    } else if(selectedRowIndex === selectedRows.length - 1) {
      if(xEnd > measure.xOfMeasure) {
        if(xEnd < measure.xOfMeasure + measure.width) { // last measure
          return this.getNoteRangeForMeasure(measure, measure.xOfMeasure, xEnd);
        } else {
          return 'all';
        }
      }
    } else {
      return 'all';
    }
  };

  onMouseDown = (e) => {
    e.preventDefault();

    const x = e.pageX;
    const y = e.pageY - SVG_TOP;

    this.setState({
      dragStart: { x, y },
      x,
      y,
      selectedRanges: undefined
    });
  };

  onMouseUp = () => {
    const { x, y, dragHeight, dragWidth } = this.state;

    let selectedRows;
    if(dragWidth > 5 && dragHeight > 5) {
      const startRow = Math.floor(y / this.props.rowHeight);
      const endRow = Math.floor((y + dragHeight) / this.props.rowHeight);
      selectedRows = Array.from({ length: endRow - startRow + 1 }, (_, k) => k + startRow);
    }

    const selectRange = this.props.measures.reduce((accum, measure, i) => {
      const measureRange = this.getSelectedRange(measure, x, x + dragWidth, selectedRows);
      const obj = {};
      obj[i] = measureRange;
      return measureRange ? Object.assign({}, accum, obj) : accum;
    }, {});

    if(Object.keys(selectRange).length > 0) {
      this.props.setSelectRange(selectRange);
    } else {
      this.props.setSelectRange(undefined);
    }

    this.setState({
      dragStart: undefined,
      x: undefined,
      y: undefined,
      dragWidth: undefined,
      dragHeight: undefined
    });
  };

  onMouseMove = (e) => {
    if(this.state.dragStart) {
      e.preventDefault();

      const x = e.pageX + 5;
      const y = e.pageY - SVG_TOP;

      this.setState({
        x: Math.min(this.state.dragStart.x, x),
        y: Math.min(this.state.dragStart.y, y),
        dragWidth: Math.abs(this.state.dragStart.x - x),
        dragHeight: Math.abs(this.state.dragStart.y - y)
      });
    }
  }

  render() {
    const { height, width, measures } = this.props;
    const { x, y, dragWidth, dragHeight, selectRanges } = this.state;

    return (
      <div style={{ ...style, height, width }}
        onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove}>
        { measures.map((_, i) => <Measure key={i} measureIndex={i} selected={selectRanges ? selectRanges[i] : undefined} />) }
        <SelectBox height={height} width={width} x={x} y={y} dragWidth={dragWidth} dragHeight={dragHeight} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setSelectRange: bindActionCreators(setSelectRange, dispatch)
  };
}

export default connect(scoreSelector, mapDispatchToProps)(Score);
