import { memoize } from 'lodash';
import { getIndexOfNote, getStaffPositionOfNote, midiNotes } from './midiNotes';

const midis = midiNotes();

const annotateNote = (note, yTop, tuning) => {
  if (note.string[0] === 'rest') {
    return ['rest'];
  }

  return note.fret.map((fret, i) => {
    const midiIndex = getIndexOfNote(tuning[note.string[i]]) + fret;
    const midiString = midis[midiIndex];
    const staffPosition = getStaffPositionOfNote(midiString.replace('#', ''));
    return {
      y: yTop + 249 - 6.5 * staffPosition,
      sharp: midiString.charAt(1) === '#',
      midiString
    };
  });
};

export const annotateNotes = (notes, yTop, playingNoteIndex, tuning) => {
  return notes.map((note, noteIndex) => {
    return {
      ...note,
      color: playingNoteIndex === noteIndex ? '#f9423a' : 'black',
      y: 5 * 6.5 + 6 + yTop,
      notes: annotateNote(note, yTop, tuning)
    };
  });
};

export const determineAccidentals = notes => {
  return notes.map((note, i) => {
    return {
      ...note,
      notes: note.notes.map(anote => {
        if (i === 0) {
          return { ...anote, renderSharp: anote.sharp ? anote.sharp : false };
        } else if (anote === 'rest') {
          return anote;
        }

        if (anote.sharp) {
          let renderSharp;
          Array.from({ length: i }, (_, index) => {
            const noteBefore = notes[index];

            noteBefore.notes.forEach(beforeNote => {
              if (beforeNote === 'rest') {
                if (renderSharp === undefined) {
                  renderSharp = true;
                }
              } else {
                const isSameMidi =
                  beforeNote.midiString.replace('#', '') ===
                  anote.midiString.replace('#', '');
                const isBeforeNoteSharp =
                  beforeNote.midiString.charAt(1) === '#';
                if (isSameMidi) {
                  renderSharp = isBeforeNoteSharp ? false : true;
                } else {
                  if (renderSharp === undefined) {
                    renderSharp = true;
                  }
                }
              }
            });
          });

          return { ...anote, renderSharp };
        } else {
          let renderNatural;
          Array.from({ length: i }, (_, index) => {
            const noteBefore = notes[index];

            noteBefore.notes.forEach(beforeNote => {
              if (beforeNote !== 'rest') {
                if (
                  beforeNote.midiString.replace('#', '') ===
                  anote.midiString.replace('#', '')
                ) {
                  renderNatural = beforeNote.midiString.charAt(1) === '#';
                }
              }
            });
          });

          return { ...anote, renderNatural };
        }
      })
    };
  });
};

export const getAccidentals = memoize(
  (notes, yTop, playingNoteIndex, tuning) => {
    return determineAccidentals(
      annotateNotes(notes, yTop, playingNoteIndex, tuning)
    );
  }
);
