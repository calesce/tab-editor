import React, { Component } from 'react';
import { connect } from 'react-redux';
import { scoreSelector } from '../util/selectors';
import shouldPureComponentUpdate from 'react-pure-render/function';

import Measure from './measure/Measure';

const style = {
  padding: 5,
  paddingTop: 60,
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
    const rect = this.page.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY; //- rect.top;

    this.setState({
      dragStart: { x, y }
    });
  };

  onMouseUp = () => {
    this.setState({
      dragStart: undefined,
      dragEnd: undefined
    });
  };

  onMouseMove = (e) => {
    if(this.state.dragStart) {
      const rect = this.page.getBoundingClientRect();
      const x = e.pageX - rect.left;
      const y = e.pageY; //- rect.top;

      this.setState({
        dragEnd: { x, y }
      });
    }
  }

  render() {
    const { height, width, measures } = this.props;
    const { dragStart, dragEnd } = this.state;

    // console.log(this.state);
    let x, y, dragWidth, dragHeight;
    if(dragStart && dragEnd) {
      x = Math.min(dragStart.x, dragEnd.x);
      y = Math.min(dragStart.y, dragEnd.y);
      dragWidth = Math.abs(dragStart.x - dragEnd.x);
      dragHeight = Math.abs(dragStart.y - dragEnd.y);
    }

    return (
      <div style={{ ...style, height, width }}
        onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove}
        ref={(ref) => this.page = ref}>
        <svg>
          { dragStart && dragEnd ?
          <rect fill='black' stroke='black'
            x={x} y={y} width={dragWidth} height={dragHeight} />
            : null
          }

          </svg>
        { measures.map((_, i) => <Measure key={i} measureIndex={i} />) }
      </div>
    );
  }
}
export default connect(scoreSelector)(Score);
