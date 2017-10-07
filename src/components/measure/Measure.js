import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { makeMapStateToProps } from '../../util/selectors';
import { makeMeasureSelector } from '../../util/selectors/measure';

import MusicMeasure from './MusicMeasure';
import TabMeasure from './TabMeasure';
import MeasureSelectBox from './MeasureSelectBox';

class Measure extends PureComponent {
  render() {
    const {
      measure,
      playingNoteIndex,
      isLastMeasure,
      isValid,
      yTop,
      tuning,
      selectRange,
      rowHeight
    } = this.props;
    const measureHeight = rowHeight + tuning.length * 20;

    return (
      <svg height={measureHeight} width={measure.width}>
        <MusicMeasure
          measure={measure}
          playingNoteIndex={playingNoteIndex}
          isLastMeasure={isLastMeasure}
          isValid={isValid}
          rowHeight={rowHeight}
          yTop={yTop}
        />
        <TabMeasure
          measure={measure}
          playingNoteIndex={playingNoteIndex}
          isLastMeasure={isLastMeasure}
          isValid={isValid}
          rowHeight={rowHeight}
          stringCount={tuning.length}
        />
        {selectRange && (
          <MeasureSelectBox
            measure={measure}
            selectRange={selectRange}
            height={measureHeight}
          />
        )}
      </svg>
    );
  }
}

export default connect(makeMapStateToProps(makeMeasureSelector))(Measure);
