import React, { Component } from 'react';
import { connect } from 'react-redux';

import MusicMeasure from './MusicMeasure';
import TabMeasure from './TabMeasure';
import shallowEqual from 'react-pure-render/shallowEqual';
import { makeFinalMeasureSelector } from '../../util/selectors';

const MEASURE_HEIGHT = 210;

class Measure extends Component {
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.state);
  }

  render() {
    const { playingNoteIndex, measureLength, measureIndex, measure, tuning, isValid } = this.props;
    return (
      <div style={{ height: MEASURE_HEIGHT + (tuning.length * 25), width: measure.width }}>
        <MusicMeasure {...this.props} measureHeight={MEASURE_HEIGHT} y={65} />
        <TabMeasure measure={measure} playingNoteIndex={playingNoteIndex}
          measureIndex={measureIndex} measureLength={measureLength}
          isValid={isValid} stringCount={tuning.length} displayOption='both' />
      </div>
    );
  }
}

const makeMapStateToProps = () => {
  const measureSelector = makeFinalMeasureSelector();
  const mapStateToProps = (state, props) => {
    return measureSelector(state, props);
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps)(Measure);
