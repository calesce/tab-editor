import { findIndex } from 'lodash';
import { PASTE_NOTE, CUT_NOTE } from '../actions/cutCopyPaste';
import {
  CHANGE_NOTE,
  DELETE_NOTE,
  CHANGE_NOTE_LENGTH,
  INSERT_NOTE,
  MAKE_NOTE_REST,
  TOGGLE_NOTE_DOTTED,
  TOGGLE_NOTE_TREMOLO,
  INCREASE_NOTE_LENGTH,
  DECREASE_NOTE_LENGTH,
  TOGGLE_NOTE_VIBRATO,
  TOGGLE_NOTE_TRILL,
  SET_NOTE_TUPLET,
  TOGGLE_REPEAT_END,
  TOGGLE_REPEAT_BEGIN
} from '../actions/measure';

import type { Measure, Note } from '../util/stateTypes';

const replaceNote = (
  state: Measure,
  note: Note,
  noteIndex: number
): Measure => {
  const notes = state.notes
    .slice(0, noteIndex)
    .concat(note)
    .concat(state.notes.slice(noteIndex + 1, state.notes.length));
  return { ...state, notes };
};

const insertNote = (state: Measure, action: Object): Measure => {
  if (state.notes.length === 0) {
    const notes = [{ duration: 'q', fret: ['rest'], string: ['rest'] }];
    return { ...state, notes };
  }

  const { noteIndex } = action.index;
  const note = {
    duration: state.notes[noteIndex].duration,
    fret: ['rest'],
    string: ['rest']
  };
  const notes = state.notes
    .slice(0, noteIndex + 1)
    .concat(note)
    .concat(state.notes.slice(noteIndex + 1, state.notes.length));
  return { ...state, notes };
};

const deleteNote = (state: Measure, action: Object): Measure => {
  const { noteIndex, stringIndex } = action.index;
  const note = state.notes[noteIndex];
  const currentStringIndex = findIndex(
    note.string,
    note => note === stringIndex
  );

  if (note.fret[0] === 'rest') {
    const notes = state.notes
      .slice(0, noteIndex)
      .concat(state.notes.slice(noteIndex + 1, state.notes.length));
    return { ...state, notes };
  } else if (currentStringIndex === -1) {
    return state;
  } else {
    let newNote;
    if (note.fret.length === 1) {
      newNote = { ...note, fret: ['rest'], string: ['rest'] };
    } else {
      newNote = {
        ...note,
        fret: note.fret.filter((fret, i) => i !== currentStringIndex),
        string: note.string.filter(string => string !== stringIndex)
      };
    }
    return replaceNote(state, newNote, noteIndex);
  }
};

const increaseNoteLength = (note: Note): string => {
  let newDuration;
  switch (note.duration) {
    case 'w':
      newDuration = 'h';
      break;
    case 'h':
      newDuration = 'q';
      break;
    case 'q':
      newDuration = 'e';
      break;
    case 'e':
      newDuration = 's';
      break;
    case 's':
      newDuration = 't';
      break;
    default:
      newDuration = 's';
  }
  return newDuration;
};

const decreaseNoteLength = (note: Note): string => {
  let newDuration;
  switch (note.duration) {
    case 't':
      newDuration = 's';
      break;
    case 's':
      newDuration = 'e';
      break;
    case 'e':
      newDuration = 'q';
      break;
    case 'q':
      newDuration = 'h';
      break;
    case 'h':
      newDuration = 'w';
      break;
    default:
      newDuration = 'w';
  }
  return newDuration;
};

const getChangedNote = (
  oldNote: Note,
  fret: number,
  stringIndex: number
): Note => {
  if (fret === 'rest') {
    return { ...oldNote, fret: ['rest'], string: ['rest'] };
  } else if (!oldNote) {
    return { fret: [fret], string: [stringIndex], duration: 'q' };
  }

  const currentStringIndex = findIndex(
    oldNote.string,
    note => note === stringIndex
  );
  if (oldNote.fret[0] === 'rest') {
    return { ...oldNote, fret: [fret], string: [stringIndex] };
  } else if (currentStringIndex === -1) {
    return {
      ...oldNote,
      fret: oldNote.fret.concat(fret),
      string: oldNote.string.concat(stringIndex)
    };
  } else {
    const oldFret = oldNote.fret[currentStringIndex];
    const newFret =
      oldFret === 1 ? fret + 10 : oldFret === 2 && fret <= 5 ? fret + 20 : fret;

    const newFrets = oldNote.fret
      .slice(0, currentStringIndex)
      .concat(newFret)
      .concat(oldNote.fret.slice(currentStringIndex + 1, oldNote.fret.length));

    return { ...oldNote, fret: newFrets };
  }
};

export default function measure(state: Measure, action: Object): Measure {
  switch (action.type) {
    case INSERT_NOTE: {
      return insertNote(state, action);
    }

    case DELETE_NOTE: {
      return deleteNote(state, action);
    }

    case TOGGLE_NOTE_DOTTED: {
      const { noteIndex } = action.index;
      const note = {
        ...state.notes[noteIndex],
        dotted: state.notes[noteIndex].dotted ? false : true
      };
      return replaceNote(state, note, noteIndex);
    }

    case TOGGLE_NOTE_TREMOLO: {
      const { noteIndex } = action.index;
      const note = {
        ...state.notes[noteIndex],
        tremolo: state.notes[noteIndex].tremolo ? false : true
      };
      return replaceNote(state, note, noteIndex);
    }

    case TOGGLE_NOTE_VIBRATO: {
      const { noteIndex } = action.index;
      const note = {
        ...state.notes[noteIndex],
        vibrato: state.notes[noteIndex].vibrato ? false : true
      };
      return replaceNote(state, note, noteIndex);
    }

    case TOGGLE_NOTE_TRILL: {
      const { noteIndex } = action.index;
      const note = {
        ...state.notes[noteIndex],
        trill: state.notes[noteIndex].trill ? false : true
      };
      return replaceNote(state, note, noteIndex);
    }

    case SET_NOTE_TUPLET: {
      const { noteIndex } = action.index;
      const note = { ...state.notes[noteIndex], tuplet: action.tuplet };
      return replaceNote(state, note, noteIndex);
    }

    case CHANGE_NOTE_LENGTH: {
      const { noteIndex } = action.index;
      const note = { ...state.notes[noteIndex], duration: action.duration };
      return replaceNote(state, note, noteIndex);
    }

    case INCREASE_NOTE_LENGTH: {
      const { noteIndex } = action.index;
      const duration = increaseNoteLength(state.notes[noteIndex]);
      const note = { ...state.notes[noteIndex], duration };
      return replaceNote(state, note, noteIndex);
    }

    case DECREASE_NOTE_LENGTH: {
      const { noteIndex } = action.index;
      const duration = decreaseNoteLength(state.notes[noteIndex]);
      const note = { ...state.notes[noteIndex], duration };
      return replaceNote(state, note, noteIndex);
    }

    case CHANGE_NOTE: {
      const { noteIndex, stringIndex } = action.index;
      const note = getChangedNote(
        state.notes[noteIndex],
        action.fret,
        stringIndex
      );
      return replaceNote(state, note, noteIndex);
    }

    case MAKE_NOTE_REST: {
      const { noteIndex } = action.index;
      const note = {
        ...state.notes[noteIndex],
        fret: ['rest'],
        string: ['rest'],
        trill: false,
        tremolo: false,
        vibrato: false
      };
      return replaceNote(state, note, noteIndex);
    }

    case PASTE_NOTE: {
      const { noteIndex } = action.index;
      if (action.clipboard.notes) {
        const notes = state.notes
          .slice(0, noteIndex + 1)
          .concat(action.clipboard.notes)
          .concat(state.notes.slice(noteIndex + 1, state.notes.length));
        return { ...state, notes };
      } else if (!Array.isArray(action.clipboard)) {
        const notes = state.notes
          .slice(0, noteIndex + 1)
          .concat(action.clipboard)
          .concat(state.notes.slice(noteIndex + 1, state.notes.length));
        return { ...state, notes };
      }

      return state;
    }

    case CUT_NOTE: {
      const { noteIndex } = action.index;

      if (action.selection.notes) {
        const measureIndex = Object.keys(action.range)[0];
        const notes = state.notes.filter((_, i) => {
          return action.range[measureIndex].indexOf(i) === -1;
        });
        return { ...state, notes };
      } else if (!Array.isArray(action.selection)) {
        const notes = state.notes
          .slice(0, noteIndex)
          .concat(state.notes.slice(noteIndex + 1, state.notes.length));
        return { ...state, notes };
      }

      return state;
    }

    case TOGGLE_REPEAT_END: {
      return { ...state, repeatEnd: !state.repeatEnd };
    }

    case TOGGLE_REPEAT_BEGIN: {
      return { ...state, repeatBegin: !state.repeatBegin };
    }

    default:
      return state;
  }
}
