import { flatten, findIndex, cloneDeep } from 'lodash';
import {
  CHANGE_NOTE, DELETE_NOTE, CHANGE_NOTE_LENGTH, INSERT_NOTE, TOGGLE_NOTE_DOTTED,
  PASTE_NOTE, CUT_NOTE, TOGGLE_NOTE_TREMOLO, INCREASE_NOTE_LENGTH, DECREASE_NOTE_LENGTH,
  TOGGLE_NOTE_VIBRATO, ADD_REPEAT_END, TOGGLE_NOTE_TRILL
} from '../actions/types';

const replaceNote = (state, note, noteIndex) => {
  const notes = flatten([state.notes.slice(0, noteIndex), note, state.notes.slice(noteIndex + 1, state.notes.length)]);
  return Object.assign({}, state, { notes });
};

const insertNote = (state, action) => {
  if(state.notes.length === 0) {
    const notes = [{
      duration: 'q',
      fret: ['rest'],
      string: ['rest']
    }];
    return Object.assign({}, state, { notes });
  }

  const { noteIndex } = action.index;
  const note = {
    duration: state.notes[noteIndex].duration,
    fret: ['rest'],
    string: ['rest']
  };
  const notes = flatten([state.notes.slice(0, noteIndex + 1), note, state.notes.slice(noteIndex + 1, state.notes.length)]);
  return Object.assign({}, state, { notes });
};

const deleteNote = (state, action) => {
  const { noteIndex, stringIndex } = action.index;
  const note = state.notes[noteIndex];
  const currentStringIndex = findIndex(note.string, (note) => note === stringIndex);

  if(note.fret[0] === 'rest') {
    const notes = flatten([state.notes.slice(0, noteIndex), state.notes.slice(noteIndex + 1, state.notes.length)]);
    return Object.assign({}, state, { notes });
  } else if(currentStringIndex === -1) {
    return state;
  } else {
    let newNote;
    if(note.fret.length === 1) {
       newNote = {
         ...note,
         fret: ['rest'],
         string: ['rest']
      };
    } else {
      newNote = {
        ...note,
        fret: note.fret.filter((fret, i) => i !== currentStringIndex),
        string:  note.string.filter((string) => string !== stringIndex)
      };
    }
    return replaceNote(state, newNote, noteIndex);
  }
};

const increaseNoteLength = (note) => {
  let newDuration;
  switch(note.duration) {
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

const decreaseNoteLength = (note) => {
  let newDuration;
  switch(note.duration) {
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

export default function measure(state, action) {
  switch(action.type) {
    case INSERT_NOTE: {
      return insertNote(state, action);
    }

    case DELETE_NOTE: {
      return deleteNote(state, action);
    }

    case TOGGLE_NOTE_DOTTED: {
      const { noteIndex } = action.index;
      const note = Object.assign({}, state.notes[noteIndex], { dotted: state.notes[noteIndex].dotted ? false : true });
      return replaceNote(state, note, noteIndex);
    }

    case TOGGLE_NOTE_TREMOLO: {
      const { noteIndex } = action.index;
      const note = Object.assign({}, state.notes[noteIndex], { tremolo: state.notes[noteIndex].tremolo ? false : true });
      return replaceNote(state, note, noteIndex);
    }

    case TOGGLE_NOTE_VIBRATO: {
      const { noteIndex } = action.index;
      const note = Object.assign({}, state.notes[noteIndex], { vibrato: state.notes[noteIndex].vibrato ? false : true });
      return replaceNote(state, note, noteIndex);
    }

    case TOGGLE_NOTE_TRILL: {
      const { noteIndex } = action.index;
      const note = Object.assign({}, state.notes[noteIndex], { trill: state.notes[noteIndex].trill ? false : true });
      return replaceNote(state, note, noteIndex);
    }

    case CHANGE_NOTE_LENGTH: {
      const { noteIndex } = action.index;
      const note = Object.assign({}, state.notes[noteIndex], { duration: action.duration });
      return replaceNote(state, note, noteIndex);
    }

    case INCREASE_NOTE_LENGTH: {
      const { noteIndex } = action.index;
      const duration = increaseNoteLength(state.notes[noteIndex]);
      const note = Object.assign({}, state.notes[noteIndex], { duration });
      return replaceNote(state, note, noteIndex);
    }

    case DECREASE_NOTE_LENGTH: {
      const { noteIndex } = action.index;
      const duration = decreaseNoteLength(state.notes[noteIndex]);
      const note = Object.assign({}, state.notes[noteIndex], { duration });
      return replaceNote(state, note, noteIndex);
    }

    case CHANGE_NOTE: {
      const { noteIndex, stringIndex } = action.index;
      const oldNote = state.notes[noteIndex];

      let note;
      if(action.fret === 'rest') {
        note = {
          ...oldNote,
          fret: ['rest'],
          string: ['rest']
        };
      } else if(!oldNote) {
        note = {
          fret: [action.fret],
          string: [stringIndex],
          duration: 'q'
        };
      } else {
        let currentStringIndex = findIndex(oldNote.string, (note) => note === stringIndex);
        if(oldNote.fret[0] === 'rest') {
          note = {
            ...oldNote,
            fret: [action.fret],
            string: [stringIndex]
          };
        } else if(currentStringIndex === -1) {
          note = {
            ...oldNote,
            fret: oldNote.fret.concat(action.fret),
            string: oldNote.string.concat(stringIndex)
          };
        } else {
          const oldFret = oldNote.fret[currentStringIndex];
          note = cloneDeep(oldNote);
          if(oldFret === 1) {
            note.fret[currentStringIndex] = action.fret + 10;
          } else if(oldFret === 2 && action.fret <= 5) {
            note.fret[currentStringIndex] = action.fret + 20;
          } else {
            note.fret[currentStringIndex] = action.fret;
          }
        }
      }

      return replaceNote(state, note, noteIndex);
    }

    case PASTE_NOTE: {
      const { noteIndex } = action.index;
      if(action.clipboard.notes) {
        const notes = flatten([state.notes.slice(0, noteIndex + 1), action.clipboard.notes, state.notes.slice(noteIndex + 1, state.notes.length)]);
        return Object.assign({}, state, { notes });
      } else if(!Array.isArray(action.clipboard)) {
        const notes = flatten([state.notes.slice(0, noteIndex + 1), action.clipboard, state.notes.slice(noteIndex + 1, state.notes.length)]);
        return Object.assign({}, state, { notes });
      }

      return state;
    }

    case CUT_NOTE: {
      const { noteIndex } = action.index;

      if(action.selection.notes) {
        const measureIndex = Object.keys(action.range)[0];
        const notes = state.notes.filter((_, i) => {
          return action.range[measureIndex].indexOf(i) === -1;
        });
        return Object.assign({}, state, { notes });
      } else if(!Array.isArray(action.selection)) {
        const notes = flatten([state.notes.slice(0, noteIndex), state.notes.slice(noteIndex + 1, state.notes.length)]);
        return Object.assign({}, state, { notes });
      }

      return state;
    }

    case ADD_REPEAT_END: {
      return {
        ...state,
        repeatEnd: true
      };
    }

    default:
      return state;
  }
}
