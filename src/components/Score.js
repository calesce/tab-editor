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

  render() {
    const { height, width, measures } = this.props;

    return (
      <div style={{ ...style, height, width }}>
      { measures.map((_, i) => <Measure key={i} measureIndex={i} />) }
      </div>
    );
  }
}

export default connect(scoreSelector)(Score);
