import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import { calcXForNote } from '../../util';
import { getIndexOfNote, getStaffPositionOfNote, midiNotes } from '../../util/midiNotes';

import MusicNote from './MusicNote';
import Bars from './Bars';
import Rest from './Rest';
import Clef from './Clef';
import TimeSignature from './TimeSignature';
import Bpm from './Bpm';
import Repeat from './Repeat';

const midis = midiNotes();

class MusicMeasure extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  annotateNotes = (notes) => {
    return notes.map((note, noteIndex) => {
      return {
        ...note,
        color: this.props.playingNoteIndex === noteIndex ? '#f9423a' : 'black',
        x: calcXForNote(this.props.measure, noteIndex),
        y: 5 * 6.5 + 6 + this.props.y,
        notes: this.annotateNote(note)
      };
    });
  };

  annotateNote = (note) => {
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
  };

  determineAccidentals = (notes) => {
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
  };

  renderTimeSignature = (measureIndex, measure, strings, yOffset, indexOfRow) => {
    const x = indexOfRow === 0 ? 36 : 20;
    const y = (strings * 6 - 6) + yOffset; // y of top of time signature
    const { renderTimeSignature, timeSignature } = measure;

    return renderTimeSignature ?
      <TimeSignature x={x} y={y} strings={strings} numerator={timeSignature[0]} denominator={timeSignature.slice(2, 4)} /> :
      null;
  };

  renderBars = (x, y, measureWidth, strings) => {
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
  };

  renderMusicNote = (note, measureIndex, noteIndex, yOffset) => {
    if(note.string[0] === 'rest') {
      return <Rest key={noteIndex} color={note.color} x={note.x} y={note.y} note={note} />;
    }

    return note.fret.map((fret, i) => {
      const yToUse = note.notes[i].y;

      let flip = yToUse <= 93;
      if(note.string.length > 1) {
        const furthestFromMiddle = note.notes.reduce((max, next) => {
          return Math.abs(max - 93) > Math.abs(next.y - 93) ? max : next.y;
        }, 93);
        flip = furthestFromMiddle <= 93;
      }

      return <MusicNote key={i} x={note.x} y={yToUse} color={note.color} duration={note.duration}
        sharp={note.notes[i].renderSharp} natural={note.notes[i].renderNatural} measureY={yOffset} flip={flip} />;
    });
  };

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
        { this.renderTimeSignature(measureIndex, measure, 5, y, measure.indexOfRow) }
        { measure.showBpm ? <Bpm y={y} bpm={measure.bpm} />  : null }
        <text x={0} y={23 + y} style={{ fontSize: 9, fill: 'tomato' }}>{measureIndex + 1}</text>
        { measure.repeatEnd ? <Repeat measureWidth={measure.width} strings={5} y={y} /> : null }
      </svg>
    );
  }
}

export default MusicMeasure;
