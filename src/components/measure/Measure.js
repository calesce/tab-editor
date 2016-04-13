import React, { Component } from 'react';
import { connect } from 'react-redux';

import MusicMeasure from './MusicMeasure';
import TabMeasure from './TabMeasure';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { finalMeasureSelector } from '../../util/selectors';

const MEASURE_HEIGHT = 210;

class Measure extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  getSelectedRangeForSingleRow = (measure, xStart, xEnd) => {
    if(xStart > measure.xOfMeasure && xEnd < measure.xOfMeasure + measure.width) {
      return {
        start: xStart - measure.xOfMeasure,
        width: xEnd - xStart
      };
    } else if((xStart < measure.xOfMeasure && xEnd > measure.xOfMeasure) ||
       (xStart > measure.xOfMeasure && xStart < measure.xOfMeasure + measure.width)) {

      if(measure.xOfMeasure < xStart) {
        return {
          start: xStart - measure.xOfMeasure,
          width: measure.width
        };
      } else if(xEnd < measure.xOfMeasure + measure.width) {
        return {
          start: 0,
          width: xEnd - measure.xOfMeasure
        };
      } else {
        return {
          start: 0,
          width: measure.width
        };
      }
    } else {
      return undefined;
    }
  };

  getSelectedRange = (measure, xStart, xEnd, selectedRows) => {
    if(selectedRows) {
      const selectedRowIndex = selectedRows.indexOf(measure.rowIndex);
      if(selectedRowIndex === -1) {
        return undefined;
      }

      if(selectedRows.length === 1) {
        return this.getSelectedRangeForSingleRow(measure, xStart, xEnd);
      } else if(selectedRowIndex === 0) {
        if(measure.xOfMeasure + measure.width > xStart) {
          if(measure.xOfMeasure < xStart) { // starting measure, need note index
            return {
              start: xStart - measure.xOfMeasure,
              width: measure.xOfMeasure + measure.width
            };
          } else {
            return {
              start: 0,
              width: measure.width
            };
          }
        }
      } else if(selectedRowIndex === selectedRows.length - 1) {
        if(xEnd > measure.xOfMeasure) {
          if(xEnd < measure.xOfMeasure + measure.width) { // last measure
            return {
              start: 0,
              width: xEnd - measure.xOfMeasure
            };
          } else {
            return {
              start: 0,
              width: measure.width
            };
          }
        }
      } else {
        return {
          start: 0,
          width: measure.width
        };
      }
    }

    return undefined;
  };

  render() {
    const { playingNoteIndex, measureLength, measureIndex, measure, tuning, isValid, selectedRows, xStart, xEnd } = this.props;
    const selected = this.getSelectedRange(measure, xStart, xEnd, selectedRows);

    return (
      <svg style={{ height: MEASURE_HEIGHT + (tuning.length * 20), width: measure.width }}>
        <MusicMeasure {...this.props} measureHeight={MEASURE_HEIGHT} y={65} />
        <TabMeasure measure={measure} playingNoteIndex={playingNoteIndex} measureIndex={measureIndex}
          measureLength={measureLength} isValid={isValid} stringCount={tuning.length} displayOption='both'
          y={MEASURE_HEIGHT} />
        { selected !== undefined ?
          <rect fill='blue' fillOpacity={0.2} x={selected.start} y={0} width={selected.width}
            height={MEASURE_HEIGHT+ (tuning.length * 20)}/> :
          null
        }
      </svg>
    );
  }
}

export default connect(finalMeasureSelector)(Measure);
