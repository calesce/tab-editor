import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { makeMapStateToProps } from '../../util/selectors';
import { makeMeasureSelector } from '../../util/measureSelectors';

import MusicMeasure from './MusicMeasure';
import TabMeasure from './TabMeasure';
import MeasureSelectBox from './MeasureSelectBox';

class Measure extends PureComponent {
  render() {
    const { measure, playingNoteIndex, measureIndex, measureLength, isValid, yTop,
      tuning, selectRange, rowHeight } = this.props;
    const measureHeight = rowHeight + (tuning.length * 20);

    return (
      <svg height={measureHeight} width={measure.width}>
        <MusicMeasure
          measure={measure}
          playingNoteIndex={playingNoteIndex}
          measureIndex={measureIndex}
          measureLength={measureLength}
          isValid={isValid}
          rowHeight={rowHeight}
          yTop={yTop}
        />
        <TabMeasure
          measure={measure}
          playingNoteIndex={playingNoteIndex}
          measureIndex={measureIndex}
          measureLength={measureLength}
          isValid={isValid}
          rowHeight={rowHeight}
          stringCount={tuning.length}
        />
        <MeasureSelectBox measure={measure} selectRange={selectRange} height={measureHeight} />
      </svg>
    );
  }
}

export default connect(makeMapStateToProps(makeMeasureSelector))(Measure);
