import React, { PureComponent } from 'react';

import { determineFlip } from '../../util/notationMath';

import MusicNote from './MusicNote';
import Staff from './Staff';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Bpm from './Bpm';
import RepeatSign from './RepeatSign';

const measureNumberStyle = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  cursor: 'default',
  fontSize: 9,
  fill: 'tomato'
};

class MusicMeasure extends PureComponent {
  renderMusicNote(note, measureIndex, noteIndex, yTop) {
    if(note.string[0] === 'rest') {
      return <Rest key={noteIndex} color={note.color} x={note.x} y={note.y} note={note} />;
    }

    return note.fret.map((fret, i) => {
      const flip = determineFlip(note, note.notes[i].y, yTop);

      return <MusicNote key={i} note={note} y={note.notes[i].y} chordIndex={i} yTop={yTop} flip={flip} />;
    });
  }

  render() {
    const { measure, measureIndex, rowHeight, yTop, notes,
      playingNoteIndex, measureLength, isValid
    } = this.props;

    return (
      <svg style={{ height: rowHeight, width: measure.width, overflow: 'visible' }}>
        <Staff measureWidth={measure.width} y={yTop} playingNoteIndex={playingNoteIndex}
          strings={5} lastMeasure={measureIndex === measureLength - 1} isValid={isValid}
        />
        {
          notes.map((note, noteIndex) => this.renderMusicNote(note, measureIndex, noteIndex, yTop))
        }
        { measure.indexOfRow === 0 ? <Clef y={yTop} strings={5} treble repeatBegin={measure.repeatBegin} /> : null }
        <TimeSignature yOffset={yTop} strings={5} measure={measure} repeatBegin={measure.repeatBegin} />
        { measure.renderBpm ? <Bpm y={yTop} bpm={measure.bpm} />  : null }
        <text x={0} y={23 + yTop} style={measureNumberStyle}>{measureIndex + 1}</text>
        { measure.repeatEnd ?
          <RepeatSign measureWidth={measure.width} strings={5} y={yTop + 25} repeatEnd={measure.repeatEnd} />
          : null }
        { measure.repeatBegin ? <RepeatSign measureWidth={measure.width} strings={5} y={yTop + 25} repeatEnd={false} />
          : null }
      </svg>
    );
  }
}

export default MusicMeasure;
