import React, { PureComponent } from 'react';
import { StyleSheet, css } from 'aphrodite';

import MusicNote from './MusicNote';
import Staff from './Staff';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import TempoMarker from './TempoMarker';
import RepeatSign from './RepeatSign';

const styles = StyleSheet.create({
  svg: { overflow: 'visible' },
  measureNumber: {
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    cursor: 'default',
    fontSize: 9,
    fill: 'tomato'
  }
});

class MusicMeasure extends PureComponent {
  renderMusicNote(note, noteIndex, yTop, playingNoteIndex) {
    const color = playingNoteIndex === noteIndex ? '#f9423a' : 'black';
    if (note.string[0] === 'rest') {
      return (
        <Rest key={noteIndex} x={note.x} y={note.y} note={note} color={color} />
      );
    }

    return note.fret.map((fret, i) => (
      <MusicNote key={i} note={note} chordIndex={i} yTop={yTop} color={color} />
    ));
  }

  render() {
    const {
      measure,
      rowHeight,
      yTop,
      playingNoteIndex,
      isLastMeasure,
      isValid
    } = this.props;

    return (
      <svg height={rowHeight} width={measure.width} className={css(styles.svg)}>
        <Staff
          measureWidth={measure.width}
          y={yTop}
          strings={5}
          isValid={isValid}
          lastMeasure={isLastMeasure}
        />
        {measure.notes.map((note, noteIndex) =>
          this.renderMusicNote(note, noteIndex, yTop, playingNoteIndex)
        )}
        {measure.indexOfRow === 0 && (
          <Clef y={yTop} strings={5} treble repeatBegin={measure.repeatBegin} />
        )}
        <TimeSignature
          yOffset={yTop}
          strings={5}
          measure={measure}
          repeatBegin={measure.repeatBegin}
        />
        {measure.renderTempo && <TempoMarker y={yTop} tempo={measure.tempo} />}
        <text x={0} y={23 + yTop} className={css(styles.measureNumber)}>
          {measure.measureIndex + 1}
        </text>
        {measure.repeatEnd && (
          <RepeatSign
            measureWidth={measure.width}
            strings={5}
            y={yTop + 25}
            repeatEnd={measure.repeatEnd}
          />
        )}
        {measure.repeatBegin && (
          <RepeatSign
            measureWidth={measure.width}
            strings={5}
            y={yTop + 25}
            repeatEnd={false}
          />
        )}
      </svg>
    );
  }
}

export default MusicMeasure;
