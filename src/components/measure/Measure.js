import React, { Component } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { finalMeasureSelector } from '../../util/selectors';

import MusicMeasure from './MusicMeasure';
import TabMeasure from './TabMeasure';
import MeasureSelectBox from './MeasureSelectBox';

const MEASURE_HEIGHT = 210;

class Measure extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { playingNoteIndex, measureLength, measureIndex, measure, tuning, isValid, selectRange } = this.props;

    return (
      <svg style={{ height: MEASURE_HEIGHT + (tuning.length * 20), width: measure.width }}>
        <MusicMeasure {...this.props} measureHeight={MEASURE_HEIGHT} y={65} />
        <TabMeasure measure={measure} playingNoteIndex={playingNoteIndex} measureIndex={measureIndex}
          measureLength={measureLength} isValid={isValid} stringCount={tuning.length} displayOption='both'
          y={MEASURE_HEIGHT} />
        <MeasureSelectBox measure={measure} selected={selectRange} height={MEASURE_HEIGHT + (tuning.length * 20)}/>
      </svg>
    );
  }
}

const makeMeasureSelector = () => {
  return finalMeasureSelector;
};

const makeMapStateToProps = () => {
  const measureSelector = makeMeasureSelector();
  const mapStateToProps = (state, props) => {
    return measureSelector(state, props);
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps)(Measure);
