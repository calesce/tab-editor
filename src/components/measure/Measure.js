import React, { Component } from 'react';
import { connect } from 'react-redux';
import shallowCompare from 'react-addons-shallow-compare';

import { makeMapStateToProps } from '../../util/selectors';
import { makeMeasureSelector } from '../../util/measureSelectors';

import MusicMeasure from './MusicMeasure';
import TabMeasure from './TabMeasure';
import MeasureSelectBox from './MeasureSelectBox';

class Measure extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { playingNoteIndex, measureLength, measureIndex, measure,
      tuning, isValid, selectRange, rowHeight } = this.props;

    return (
      <svg style={{ height: rowHeight + (tuning.length * 20), width: measure.width }}>
        <MusicMeasure {...this.props} />
        <TabMeasure measure={measure} playingNoteIndex={playingNoteIndex} measureIndex={measureIndex}
          measureLength={measureLength} isValid={isValid} stringCount={tuning.length} displayOption='both'
          y={rowHeight} />
        <MeasureSelectBox measure={measure} selected={selectRange} height={rowHeight + (tuning.length * 20)}/>
      </svg>
    );
  }
}

export default connect(makeMapStateToProps(makeMeasureSelector))(Measure);
