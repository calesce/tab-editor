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

  onMouseDown = (e) => {
    e.preventDefault();

    const x = e.pageX;
    const y = e.pageY - SVG_TOP;

    this.setState({
      dragStart: { x, y },
      x,
      y,
      selectedRows: undefined,
      xStart: undefined,
      xEnd: undefined
    });
  };

  onMouseUp = () => {
    // TODO call action creator to define the select range
    const { x, y, dragHeight, dragWidth } = this.state;

    const startRow = Math.floor(y / this.props.rowHeight);
    const endRow = Math.floor((y + dragHeight) / this.props.rowHeight);
    const selectedRows = Array.from({ length: endRow - startRow + 1 }, (_, k) => k + startRow);

    this.setState({
      dragStart: undefined,
      x: undefined,
      y: undefined,
      dragWidth: undefined,
      dragHeight: undefined,
      selectedRows,
      xStart: x,
      xEnd: x + dragWidth
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
    const { x, y, dragWidth, dragHeight, selectedRows, xStart, xEnd } = this.state;

    return (
      <div style={{ ...style, height, width }}
        onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove}>
        { measures.map((_, i) => <Measure key={i} measureIndex={i} xStart={xStart} xEnd={xEnd} selectedRows={selectedRows} />) }
        <SelectBox height={height} width={width} x={x} y={y} dragWidth={dragWidth} dragHeight={dragHeight} />
      </div>
    );
  }
}
export default connect(scoreSelector)(Score);
