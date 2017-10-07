import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { findIndex } from 'lodash';
import { StyleSheet, css } from 'aphrodite';

import { makeMapStateToProps } from '../../util/selectors';
import { makeTabMeasureSelector } from '../../util/selectors/measure';

import TabNote from './TabNote';
import Staff from './Staff';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Cursor from './Cursor';
import TempoMarker from './TempoMarker';
import RepeatSign from './RepeatSign';

import { setCursor } from '../../actions/cursor';

const styles = StyleSheet.create({
  measureNumber: { fontSize: 9, fill: 'tomato' }
});

class TabMeasure extends PureComponent {
  onClick = (noteIndex, stringIndex) => {
    this.props.setCursor({
      noteIndex,
      stringIndex,
      measureIndex: this.props.measure.measureIndex
    });
  };

  onSvgClick = e => {
    const { stringCount, measure } = this.props;
    const svgRect = this._element.getBoundingClientRect();
    const relativeX = e.clientX - svgRect.left;
    const relativeY = e.clientY - svgRect.top - 25;

    const noteIndex = this.getNoteAtX(relativeX, measure.notes);
    const stringIndex = this.getStringAtY(relativeY, stringCount);
    if (stringIndex >= 0 && stringIndex < stringCount) {
      this.props.setCursor({
        noteIndex,
        stringIndex,
        measureIndex: measure.measureIndex
      });
    }
  };

  getNoteAtX(x, notes) {
    const noteIndex = findIndex(notes, note => note.x + 38 > x);
    return noteIndex === -1 ? notes.length - 1 : noteIndex;
  }

  getStringAtY(y, stringCount) {
    return Math.floor(-1 * ((y - 95 + 8.5) / 13) - 6 + stringCount) - 1;
  }

  renderCursor(cursor, measure, stringCount) {
    const { noteIndex, stringIndex } = cursor;
    const y = 95 - 13 * (stringIndex + (6 - stringCount));

    let index = 0;
    let fret = 0;
    let x = 10;

    if (!measure.notes[noteIndex]) {
      if (measure.indexOfRow === 0) {
        x += 8;
      }
      if (measure.renderTimeSignature) {
        x += 30;
      }
    } else if (measure.notes.length > 0) {
      index = findIndex(
        measure.notes[noteIndex].string,
        s => s === stringIndex
      );
      fret = measure.notes[noteIndex].fret[index];
      x = measure.notes[noteIndex] ? measure.notes[noteIndex].x : 10;
    }

    return <Cursor x={x} y={y} fret={fret} />;
  }

  renderTabNote(note, noteIndex) {
    const { playingNoteIndex, stringCount, displayOption } = this.props;

    const color = playingNoteIndex === noteIndex ? '#f9423a' : 'black';
    const y = stringCount * 6.5 + 6;

    // 45 for 6 strings
    if (note.string[0] === 'rest') {
      return (
        <Rest
          onClick={this.onClick}
          key={noteIndex}
          noteIndex={noteIndex}
          color={color}
          x={note.x}
          y={y}
          note={note}
        />
      );
    }

    return [0, 1, 2, 3, 4, 5].map((_, i) => {
      const stringIndex = findIndex(note.string, index => index === i);
      const fret = stringIndex === -1 ? undefined : note.fret[stringIndex];
      if (fret === undefined) {
        return null;
      }
      const string = stringIndex === -1 ? i : note.string[stringIndex];
      const y = 95 - 13 * (i + 6 - stringCount);
      return (
        <TabNote
          onClick={this.onClick}
          key={i}
          y={y}
          color={color}
          noteIndex={noteIndex}
          fret={fret}
          displayOption={displayOption}
          note={note}
          stringIndex={string}
        />
      );
    });
  }

  setRef = e => (this._element = e);

  render() {
    const {
      stringCount,
      measure,
      displayOption,
      rowHeight,
      isValid,
      isLastMeasure,
      cursor
    } = this.props;

    return (
      <svg
        y={rowHeight}
        ref={this.setRef}
        height={stringCount * 25}
        width={measure.width}
      >
        <Staff
          measureWidth={measure.width}
          y={0}
          strings={stringCount}
          isValid={isValid}
          lastMeasure={isLastMeasure}
        />
        <rect
          onClick={this.onSvgClick}
          height={stringCount * 25}
          width={measure.width}
          opacity={0}
        />
        {measure.notes.map((note, noteIndex) =>
          this.renderTabNote(note, noteIndex)
        )}
        {displayOption === 'tab' && (
          <TempoMarker
            tab
            y={0}
            tempo={measure.tempo}
            renderTempo={measure.renderTempo}
            displayOption={displayOption}
          />
        )}
        {displayOption === 'tab' && (
          <text x={0} y={23} className={css(styles.measureNumber)}>
            {measure.measureIndex + 1}
          </text>
        )}
        {measure.indexOfRow === 0 && (
          <Clef
            y={25}
            strings={stringCount}
            repeatBegin={measure.repeatBegin}
            tab
          />
        )}
        {displayOption === 'tab' && (
          <TimeSignature
            yOffset={0}
            strings={stringCount}
            measure={measure}
            displayOption={displayOption}
            repeatBegin={measure.repeatBegin}
          />
        )}
        {cursor && this.renderCursor(cursor, measure, stringCount)}
        {measure.repeatEnd && (
          <RepeatSign
            measureWidth={measure.width}
            strings={stringCount}
            y={25}
            repeatEnd={true}
          />
        )}
        {measure.repeatBegin && (
          <RepeatSign
            measureWidth={measure.width}
            strings={stringCount}
            y={25}
            repeatEnd={false}
          />
        )}
      </svg>
    );
  }
}
TabMeasure.defaultProps = { displayOption: 'both' };

export default connect(makeMapStateToProps(makeTabMeasureSelector), {
  setCursor
})(TabMeasure);
