import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import { getIndexOfNote, getStaffPositionOfNote, midiNotes } from '../../util/midiNotes';
import { determineFlip } from '../../util/notationMath';

import MusicNote from './MusicNote';
import Bars from './Bars';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Bpm from './Bpm';
import Repeat from './Repeat';

const midis = midiNotes();

const measureNumberStyle = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  cursor: 'default',
  fontSize: 9,
  fill: 'tomato'
};

class MusicMeasure extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor() {
    super();

    this.annotateNotes = this.annotateNotes.bind(this);
    this.annotateNote = this.annotateNote.bind(this);
    this.determineAccidentals = this.determineAccidentals.bind(this);
    this.renderBars = this.renderBars.bind(this);
    this.renderMusicNote = this.renderMusicNote.bind(this);
  }

  annotateNotes(notes) {
    return notes.map((note, noteIndex) => {
      return {
        ...note,
        color: this.props.playingNoteIndex === noteIndex ? '#f9423a' : 'black',
        y: 5 * 6.5 + 6 + this.props.y,
        notes: this.annotateNote(note)
      };
    });
  }

  annotateNote(note) {
    if(note.string[0] === 'rest') {
      return ['rest'];
    }

    return note.fret.map((fret, i) => {
      const midiIndex = getIndexOfNote(this.props.tuning[note.string[i]]) + fret;
      const midiString = midis[midiIndex];
      const staffPosition = getStaffPositionOfNote(midiString.replace('#', ''));
      return {
        y: this.props.y + 249 - (6.5 * staffPosition),
        sharp: midiString.charAt(1) === '#',
        midiString
      };
    });
  }

  determineAccidentals(notes) {
    return notes.map((note, i) => {
      return {
        ...note,
        notes: note.notes.map((anote) => {
          if(i === 0) {
            return {
              ...anote,
              renderSharp: anote.sharp ? anote.sharp : false
            };
          } else if(anote === 'rest') {
            return anote;
          }

          if(anote.sharp) {
            let renderSharp;
            Array.from({ length: i }, (_, index) => {
              const noteBefore = notes[index];

              noteBefore.notes.forEach((beforeNote) => {
                if(beforeNote === 'rest') {
                  if(renderSharp === undefined) {
                    renderSharp = true;
                  }
                } else {
                  const isSameMidi = beforeNote.midiString.replace('#', '') === anote.midiString.replace('#', '');
                  const isBeforeNoteSharp = beforeNote.midiString.charAt(1) === '#';
                  if(isSameMidi) {
                    renderSharp = isBeforeNoteSharp ? false : true;
                  } else {
                    if(renderSharp === undefined) {
                      renderSharp = true;
                    }
                  }
                }
              });
            });

            return {
              ...anote,
              renderSharp
            };
          } else {
            let renderNatural;
            Array.from({ length: i }, (_, index) => {
              const noteBefore = notes[index];

              noteBefore.notes.forEach((beforeNote) => {
                if(beforeNote !== 'rest') {
                  if(beforeNote.midiString.replace('#', '') === anote.midiString.replace('#', '')) {
                    renderNatural = beforeNote.midiString.charAt(1) === '#';
                  }
                }
              });
            });

            return {
              ...anote,
              renderNatural
            };
          }
        })
      };
    });
  }

  renderBars(x, y, measureWidth, strings) {
    const { playingNoteIndex, isValid, measureIndex, measureLength } = this.props;

    const lastMeasure = measureIndex === measureLength - 1;
    let color = '#999999';
    let strokeWidth = 0.1;
    if(playingNoteIndex !== undefined) {
      color = '#267754';
      strokeWidth = 1;
    } else if(!isValid) {
      color = 'red';
      strokeWidth = 1;
    }

    return <Bars measureWidth={measureWidth} color={color} y={y} spaceBetweenBars={13}
      strokeWidth={strokeWidth} strings={strings} lastMeasure={lastMeasure}
    />;
  }

  renderMusicNote(note, measureIndex, noteIndex, yOffset) {
    if(note.string[0] === 'rest') {
      return <Rest key={noteIndex} color={note.color} x={note.x} y={note.y} note={note} />;
    }

    return note.fret.map((fret, i) => {
      const yToUse = note.notes[i].y;
      const flip = determineFlip(note, yToUse);

      return <MusicNote key={i} x={note.x} y={yToUse} color={note.color} duration={note.duration} dotted={note.dotted}
        sharp={note.notes[i].renderSharp} natural={note.notes[i].renderNatural} measureY={yOffset} flip={flip}
        tremolo={note.tremolo} vibrato={note.vibrato} trill={note.trill} tuplet={note.tuplet} />;
    });
  }

  render() {
    const { measure, measureIndex, measureHeight, y } = this.props;

    // TODO move this logic to a selector
    const notes = this.determineAccidentals(this.annotateNotes(measure.notes));

    return (
      <svg style={{ height: measureHeight, width: measure.width, overflow: 'visible' }}>
        { this.renderBars(0, y, measure.width, 5) }
        {
          notes.map((note, noteIndex) => this.renderMusicNote(note, measureIndex, noteIndex, y))
        }
        { measure.indexOfRow === 0 ? <Clef y={y} strings={5} treble /> : null }
        <TimeSignature yOffset={y} strings={5} measure={measure} />
        { measure.showBpm ? <Bpm y={y} bpm={measure.bpm} />  : null }
        <text x={0} y={23 + y} style={measureNumberStyle}>{measureIndex + 1}</text>
        { measure.repeatEnd ? <Repeat measureWidth={measure.width} strings={5} y={y} /> : null }
      </svg>
    );
  }
}

export default MusicMeasure;
