import React, { Component } from 'react';
import { connect } from 'react-redux';
import { scoreSelector } from '../util/selectors';
import shouldPureComponentUpdate from 'react-pure-render/function';

import Measure from './measure/Measure';
import SelectBox from './SelectBox';

const SVG_TOP = 50;

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

  getSelectedRangeForSingleRow = (measure, xStart, xEnd) => {
    if(xStart > measure.xOfMeasure && xEnd < measure.xOfMeasure + measure.width) {
      return {
        start: xStart - measure.xOfMeasure,
        width: xEnd - xStart
      };
    } else if((xStart < measure.xOfMeasure && xEnd > measure.xOfMeasure) ||
       (xStart > measure.xOfMeasure && xStart < measure.xOfMeasure + measure.width)) {

      if(measure.xOfMeasure < xStart) {
        return {
          start: xStart - measure.xOfMeasure,
          width: measure.width
        };
      } else if(xEnd < measure.xOfMeasure + measure.width) {
        return {
          start: 0,
          width: xEnd - measure.xOfMeasure
        };
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
          return {
            start: xStart - measure.xOfMeasure,
            width: measure.xOfMeasure + measure.width
          };
        } else {
          return 'all';
        }
      }
    } else if(selectedRowIndex === selectedRows.length - 1) {
      if(xEnd > measure.xOfMeasure) {
        if(xEnd < measure.xOfMeasure + measure.width) { // last measure
          return {
            start: 0,
            width: xEnd - measure.xOfMeasure
          };
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
    // TODO call action creator to define the select range
    const { x, y, dragHeight, dragWidth } = this.state;

    let selectedRows;
    if(dragWidth > 5 && dragHeight > 5) {
      const startRow = Math.floor(y / this.props.rowHeight);
      const endRow = Math.floor((y + dragHeight) / this.props.rowHeight);
      selectedRows = Array.from({ length: endRow - startRow + 1 }, (_, k) => k + startRow);
    }

    const selectRanges = this.props.measures.map(measure => this.getSelectedRange(measure, x, x + dragWidth, selectedRows));

    this.setState({
      dragStart: undefined,
      x: undefined,
      y: undefined,
      dragWidth: undefined,
      dragHeight: undefined,
      selectRanges
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
export default connect(scoreSelector)(Score);
