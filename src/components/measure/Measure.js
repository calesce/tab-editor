import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { makeMapStateToProps } from '../../util/selectors';
import { makeMeasureSelector } from '../../util/measureSelectors';

import MusicMeasure from './MusicMeasure';
import TabMeasure from './TabMeasure';
import MeasureSelectBox from './MeasureSelectBox';

class Measure extends PureComponent {
  render() {
    const { playingNoteIndex, measureLength, measureIndex, measure, yTop, notesWithAccidentals,
      tuning, isValid, selectRange, rowHeight } = this.props;
    const measureHeight = rowHeight + (tuning.length * 20);

    return (
      <svg style={{ height: measureHeight, width: measure.width }}>
        <MusicMeasure measure={measure} playingNoteIndex={playingNoteIndex} measureIndex={measureIndex}
          measureLength={measureLength} isValid={isValid} rowHeight={rowHeight} yTop={yTop}
          notes={notesWithAccidentals} />
        <TabMeasure measure={measure} playingNoteIndex={playingNoteIndex} measureIndex={measureIndex}
          stringCount={tuning.length} displayOption='both' y={rowHeight} isValid={isValid}
        />
        <MeasureSelectBox measure={measure} selected={selectRange} height={measureHeight} />
      </svg>
    );
  }
}

export default connect(makeMapStateToProps(makeMeasureSelector))(Measure);
