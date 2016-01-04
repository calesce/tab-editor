import _ from 'lodash';
import {
  CHANGE_NOTE, DELETE_NOTE, CHANGE_NOTE_LENGTH, INSERT_NOTE, TOGGLE_NOTE_DOTTED, CHANGE_TIME_SIGNATURE,
  PASTE_NOTE, CUT_NOTE, TOGGLE_NOTE_TREMELO
} from '../actions/types';

const replaceNote = (state, note, noteIndex) => {
  const notes = _.flatten([state.notes.slice(0, noteIndex), note, state.notes.slice(noteIndex + 1, state.notes.length)]);
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
  const notes = _.flatten([state.notes.slice(0, noteIndex + 1), note, state.notes.slice(noteIndex + 1, state.notes.length)]);
  return Object.assign({}, state, { notes });
};

const deleteNote = (state, action) => {
  const { noteIndex, stringIndex } = action.index;
  const note = state.notes[noteIndex];
  const currentStringIndex = _.findIndex(note.string, (note) => note === stringIndex);

  if(note.fret[0] === 'rest') {
    const notes = _.flatten([state.notes.slice(0, noteIndex), state.notes.slice(noteIndex + 1, state.notes.length)]);
    return Object.assign({}, state, { notes });
  } else if(currentStringIndex === -1) {
    return state;
  } else {
    let newNote;
    if(note.fret.length === 1) {
       newNote = {
        fret: ['rest'],
        string: ['rest'],
        duration: note.duration,
        dotted: note.dotted
      };
    } else {
      newNote = {
        fret: note.fret.filter((fret, i) => i !== currentStringIndex),
        string:  note.string.filter((string) => string !== stringIndex),
        duration: note.duration,
        dotted: note.dotted
      };
    }
    return replaceNote(state, newNote, noteIndex);
  }
};

export default function measure(state, action) {
  switch(action.type) {
    case CHANGE_TIME_SIGNATURE: {
      return {
        ...state,
        timeSignature: action.timeSignature
      };
    }

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

    case TOGGLE_NOTE_TREMELO: {
      const { noteIndex } = action.index;
      const note = Object.assign({}, state.notes[noteIndex], { tremelo: state.notes[noteIndex].tremelo ? false : true });
      return replaceNote(state, note, noteIndex);
    }

    case CHANGE_NOTE_LENGTH: {
      const { noteIndex } = action.index;
      const note = Object.assign({}, state.notes[noteIndex], { duration: action.duration });
      return replaceNote(state, note, noteIndex);
    }

    case CHANGE_NOTE: {
      const { noteIndex, stringIndex } = action.index;
      const oldNote = state.notes[noteIndex];

      let note;
      if(action.fret === 'rest') {
        note = {
          fret: ['rest'],
          string: ['rest'],
          duration: oldNote.duration,
          dotted: oldNote.dotted
        };
      } else if(!oldNote) {
        note = {
          fret: [action.fret],
          string: [stringIndex],
          duration: 'q'
        };
      } else {
        let currentStringIndex = _.findIndex(oldNote.string, (note) => note === stringIndex);
        if(oldNote.fret[0] === 'rest') {
          note = {
            fret: [action.fret],
            string: [stringIndex],
            duration: oldNote.duration,
            dotted: oldNote.dotted
          };
        } else if(currentStringIndex === -1) {
          note = {
            fret: oldNote.fret.concat(action.fret),
            string: oldNote.string.concat(stringIndex),
            duration: oldNote.duration,
            dotted: oldNote.dotted
          };
        } else {
          const oldFret = oldNote.fret[currentStringIndex];
          note = oldNote;
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
      const notes = _.flatten([state.notes.slice(0, noteIndex + 1), action.note, state.notes.slice(noteIndex + 1, state.notes.length)]);
      return Object.assign({}, state, { notes });
    }

    case CUT_NOTE: {
      const { noteIndex } = action.index;
      const notes = _.flatten([state.notes.slice(0, noteIndex), state.notes.slice(noteIndex + 1, state.notes.length)]);
      return Object.assign({}, state, { notes });
    }

    default:
      return state;
  }
}
