import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as Actions from '../../actions/cursor';

import TabNote from './TabNote';
import Bars from './Bars';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Cursor from './Cursor';
import Bpm from './Bpm';

class Measure extends Component {
  calcMeasureValidity = (measure) => {
    const timeSig = parseInt(measure.timeSignature[0]) / parseInt(measure.timeSignature.slice(2, 4));
    const notesTotal = measure.notes.reduce((total, note) => {
      let duration;
      switch(note.duration) {
        case 'q':
          duration = 0.25;
          break;
        case 'e':
          duration = 0.125;
          break;
        case 's':
          duration = 0.0625;
          break;
        case 'h':
         duration = 0.5;
         break;
        default:
         duration = 1.0;
      }

      if(note.dotted) {
        duration *= 1.5;
      }

      return total + duration;
    }, 0);

    return timeSig === notesTotal;
  }

  calcXForNote = (noteIndex) => {
    let x = 0 + (noteIndex * 53 + 33);
    if(this.props.indexOfRow === 0) {
      x += 8;
    }
    if(this.props.measure.renderTimeSignature) {
      x += 30;
    }
    if(this.props.measure.notes.length === 0 && this.props.indexOfRow !== 0) {
      x -= this.props.measure.renderTimeSignature ? 0 : 25;
    }
    return x;
  }

  onClick = (noteIndex, stringIndex) => {
    this.props.actions.setCursor({
      noteIndex,
      stringIndex,
      measureIndex: this.props.measureIndex
    });
  }

  renderBars = (x, measureWidth, measureIndex) => {
    const { playingNote, measure } = this.props;
    const isValid = this.calcMeasureValidity(measure);

    let color = '#999999';
    let strokeWidth = 0.1;
    if(playingNote) {
      if(measureIndex === playingNote.measure) {
        color = '#267754';
        strokeWidth = 1;
      }
    } else if(!isValid) {
      color = 'red';
      strokeWidth = 1;
    }

    return <Bars measureWidth={measureWidth} color={color} strokeWidth={strokeWidth} />;
  }

  renderCursor = () => {
    const { noteIndex, stringIndex, measureIndex } = this.props.cursor;
    if(this.props.measureIndex === measureIndex && !this.props.playingNote) {
      const x = this.calcXForNote(noteIndex);
      const y = 95 - (13 * stringIndex);

      let index = 0;
      let fret = 0;

      if(this.props.measure.notes.length > 0) {
        index = _.findIndex(this.props.measure.notes[noteIndex].string, (s) => s === stringIndex);
        fret = this.props.measure.notes[noteIndex].fret[index];
      }

      return <Cursor x={x} y={y} fret={fret} />;
    }

    return null;
  }

  renderNote = (note, measureIndex, noteIndex) => {
    const x = this.calcXForNote(noteIndex);
    const { playingNote } = this.props;

    let color = 'black';
    if(playingNote) {
      if(playingNote.measure === measureIndex && playingNote.noteIndex === noteIndex && playingNote) {
        color = '#f9423a';
      }
    }

    if(note.string[0] === 'rest') {
      return <Rest onClick={this.onClick.bind(this, noteIndex, 0)} key={noteIndex} color={color} x={x} y={0} note={note} />;
    }

    return [0, 1, 2, 3, 4, 5].map((i) => {
      const stringIndex = _.findIndex(note.string, (index) => index === i);
      const string = stringIndex === -1 ? i : note.string[stringIndex];
      const fret = stringIndex === -1 ? undefined : note.fret[stringIndex];
      const y = 95 - (13 * i);
      return (
        <g>
          <TabNote onClick={this.onClick.bind(this, noteIndex, string)}
            key={i} duration={note.duration} x={x} y={y} color={color}
            fret={fret} dotted={note.dotted} tremolo={note.tremolo}
          />
        </g>
      );
    });
  }

  renderTimeSignature = (measureIndex, measure) => {
    const x = this.props.indexOfRow === 0 ? 36 : 20;
    const { renderTimeSignature, timeSignature } = measure;

    return renderTimeSignature ? <TimeSignature x={x} numerator={timeSignature[0]} denominator={timeSignature.slice(2, 4)} /> : null;
  }

  renderBpm = (measure) => {
    return measure.showBpm ? <Bpm bpm={measure.bpm} /> : null;
  }

  renderMeasureNumber = (measureIndex) => {
    return <text x={0} y={23} style={{ fontSize: 9, fill: 'tomato' }}>{measureIndex + 1}</text>;
  }

  renderMeasure = (measureIndex, measure, x) => {
    return (
      <g>
        { this.renderBars(x, measure.width, measureIndex) }
        {
          measure.notes.map((note, noteIndex) => this.renderNote(note, measureIndex, noteIndex, x))
        }
      </g>
    );
  }

  render() {
    const { measure, measureIndex, indexOfRow } = this.props;
    return (
      <svg style={{ height: 130, width: measure.width }}>
        { this.renderMeasure(measureIndex, measure, 0) }
        { indexOfRow === 0 ? <Clef /> : null }
        { this.renderTimeSignature(measureIndex, measure) }
        { this.renderCursor() }
        { this.renderBpm(measure) }
        { this.renderMeasureNumber(measureIndex) }
      </svg>
    );
  }
}

function mapStateToProps(state, props) {
  let measureIndex = _.cloneDeep(props.measureIndex);
  if(state.tracks[state.currentTrackIndex].measures.length - 1 < props.measureIndex) {
    measureIndex -= 1;
  }
  return {
    measure: state.tracks[state.currentTrackIndex].measures[measureIndex],
    playingNote: state.playingNote,
    cursor: state.cursor
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Measure);
