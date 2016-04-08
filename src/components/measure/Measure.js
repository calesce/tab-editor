import React, { Component } from 'react';
import { connect } from 'react-redux';

import MusicMeasure from './MusicMeasure';
import TabMeasure from './TabMeasure';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { finalMeasureSelector } from '../../util/selectors';

const MEASURE_HEIGHT = 210;

class Measure extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { playingNoteIndex, measureLength, measureIndex, measure, tuning, isValid, selectedRows, xStart, xEnd } = this.props;

    let selected;
    if(selectedRows) {
      const selectedRowIndex = selectedRows.indexOf(measure.rowIndex);
      if(selectedRows.length === 1 && selectedRowIndex !== -1) {
        if((xStart < measure.xOfMeasure && xEnd > measure.xOfMeasure) ||
           (xStart > measure.xOfMeasure && xStart < measure.xOfMeasure + measure.width)) {
          selected = true;
        }
      } else if(selectedRowIndex === 0) { // first row of selection
        if(measure.xOfMeasure + measure.width > xStart) {
            selected = true;
        }
      } else if(selectedRowIndex === selectedRows.length - 1) {
        if(xEnd > measure.xOfMeasure) {
            selected = true;
        }
      } else if(selectedRowIndex !== -1) {
        selected = true;
      }
    }

    return (
      <svg style={{ height: MEASURE_HEIGHT + (tuning.length * 20), width: measure.width }}>
        <MusicMeasure {...this.props} measureHeight={MEASURE_HEIGHT} y={65} selected={selected} />
        <TabMeasure measure={measure} playingNoteIndex={playingNoteIndex} selected={selected}
          measureIndex={measureIndex} measureLength={measureLength}
          isValid={isValid} stringCount={tuning.length} displayOption='both' y={MEASURE_HEIGHT} />
        { selected ?
          <rect fill='blue' fillOpacity={0.2} x={0} y={0} width={measure.width}
            height={MEASURE_HEIGHT+ (tuning.length * 20)}/> :
          null
        }
      </svg>
    );
  }
}

export default connect(finalMeasureSelector)(Measure);
