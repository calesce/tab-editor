import React, { Component } from 'react';
import { connect } from 'react-redux';

import MusicMeasure from './MusicMeasure';
import TabMeasure from './TabMeasure';
import shallowEqual from 'react-pure-render/shallowEqual';
import { finalMeasureSelector } from '../../util/selectors';

const MEASURE_HEIGHT = 210;

class Measure extends Component {
  shouldComponentUpdate(nextProps) {
    if(this.props.playingNoteIndex !== nextProps.playingNoteIndex) {
      return true;
    }
    if(!shallowEqual(this.props.tuning, nextProps.tuning)) {
      return true;
    }

    for(let i = 0; i < this.props.measure.notes.length; i++) {
      const oldNote = this.props.measure.notes[i];
      const newNote = nextProps.measure.notes[i];

      if(!newNote) {
        return true;
      }
      if(oldNote.duration !== newNote.duration) {
        return true;
      }
      if(!shallowEqual(oldNote.string, newNote.string)) {
        return true;
      }
      if(!shallowEqual(oldNote.fret, newNote.fret)) {
        return true;
      }
    }
    const measureShallowEqual = !shallowEqual(this.props.measure, nextProps.measure);
    if(measureShallowEqual) {
      return true;
    }
    return false;
  }

  render() {
    const { playingNoteIndex, measureLength, measureIndex, measure, tuning, isValid } = this.props;
    return (
      <svg style={{ height: MEASURE_HEIGHT + (tuning.length * 25), width: measure.width }}>
        <MusicMeasure {...this.props} measureHeight={MEASURE_HEIGHT} y={65} />
        <TabMeasure measure={measure} playingNoteIndex={playingNoteIndex}
          measureIndex={measureIndex} measureLength={measureLength}
          isValid={isValid} stringCount={tuning.length} displayOption='both' y={MEASURE_HEIGHT} />
      </svg>
    );
  }
}

export default connect(finalMeasureSelector)(Measure);
