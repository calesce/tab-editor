import _ from 'lodash';
import theSong from '../song';
import { CHANGE_NOTE, DELETE_NOTE, DELETE_MEASURE, INSERT_MEASURE, CHANGE_NOTE_LENGTH, INSERT_NOTE,
  CHANGE_TIME_SIGNATURE, TOGGLE_NOTE_DOTTED
} from '../actions/types';

const initialState = theSong;

function changeNote(song, fret, index) {
  const { measureIndex, noteIndex, stringIndex } = index;

  let measure = _.cloneDeep(song[measureIndex]);
  let note = measure.notes[noteIndex];
  if(fret === 'rest') {
    measure.notes[noteIndex] = {
      fret: ['rest'],
      string: ['rest'],
      duration: note.duration,
      dotted: note.dotted
    };
  } else if(!note) {
    measure.notes[noteIndex] = {
      fret: [fret],
      string: [stringIndex],
      duration: 'q',
      dotted: note.dotted
    };
  } else {
    let currentStringIndex = _.findIndex(note.string, (note) => note === stringIndex);
    if(note.fret[0] === 'rest') {
      note = {
        fret: [fret],
        string: [stringIndex],
        duration: note.duration,
        dotted: note.dotted
      };
    } else if(currentStringIndex === -1) {
      if(note.fret.length > 0) {
        note.duration = 'q';
      }

      note.fret.push(fret);
      note.string.push(stringIndex);
    } else {
      let oldFret = note.fret[currentStringIndex];
      if(oldFret === 1) {
        note.fret[currentStringIndex] = fret + 10;
      } else if(oldFret === 2 && fret <= 5) {
        note.fret[currentStringIndex] = fret + 20;
      } else {
        note.fret[currentStringIndex] = fret;
      }
    }

    measure.notes[noteIndex] = note;
  }

  let newSong = _.cloneDeep(song);
  newSong[measureIndex] = measure;

  return newSong;
}

function deleteRest(song, index) {
  const { measureIndex, noteIndex } = index;

  let measure = _.cloneDeep(song[measureIndex]);
  measure.notes = measure.notes.filter((_, i) => i !== noteIndex);
  let newSong = _.cloneDeep(song);
  newSong[measureIndex] = measure;

  return newSong;
}

function deleteNote(song, index) {
  const { measureIndex, noteIndex, stringIndex } = index;

  let measure = _.cloneDeep(song[measureIndex]);
  let note = measure.notes[noteIndex];
  let currentStringIndex = _.findIndex(note.string, (note) => note === stringIndex);
  if(note.fret[0] === 'rest') {
    return deleteRest(song, index);
  } else if(currentStringIndex === -1) {
    return song;
  } else {
    if(note.fret.length === 1) {
      note = {
        fret: ['rest'],
        string: ['rest'],
        duration: note.duration,
        dotted: note.dotted
      };
    } else {
      note = {
        fret: note.fret.filter((fret, i) => i !== currentStringIndex),
        string:  note.string.filter((string, i) => string !== stringIndex),
        duration: note.duration,
        dotted: note.dotted
      };
    }
  }

  measure.notes[noteIndex] = note;
  let newSong = _.cloneDeep(song);
  newSong[measureIndex] = measure;

  return newSong;
}

function changeNoteLength(song, index, duration) {
  const { measureIndex, noteIndex, stringIndex } = index;

  let measure = _.cloneDeep(song[measureIndex]);
  let note = Object.assign({}, song[measureIndex].notes[noteIndex], { duration });

  measure.notes[noteIndex] = note;
  let newSong = _.cloneDeep(song);
  newSong[measureIndex] = measure;

  return newSong;
}

function toggleNoteDotted(song, index) {
  const { measureIndex, noteIndex, stringIndex } = index;

  let measure = _.cloneDeep(song[measureIndex]);
  let oldNote = song[measureIndex].notes[noteIndex];
  let note = Object.assign({}, oldNote, { dotted: oldNote.dotted ? false : true });

  measure.notes[noteIndex] = note;
  let newSong = _.cloneDeep(song);
  newSong[measureIndex] = measure;

  return newSong;
}

function insertNote(song, index) {
  const { measureIndex, noteIndex, stringIndex } = index;

  let measure = _.cloneDeep(song[measureIndex]);
  let note = {
    duration: 'q',
    fret: ['rest'],
    string: ['rest']
  };
  measure.notes = _.flatten([measure.notes.slice(0, noteIndex + 1), note, measure.notes.slice(noteIndex + 1, measure.notes.length)]);

  let newSong = _.cloneDeep(song);
  newSong[measureIndex] = measure;

  return newSong;
}

export default function song(state = initialState, action) {
  switch(action.type) {
    case CHANGE_NOTE:
      return changeNote(state, action.fret, action.index);

    case DELETE_NOTE:
      return deleteNote(state, action.index);

    case DELETE_MEASURE:
      return state.filter((_, index) => index !== action.measureIndex);

    case INSERT_MEASURE:
      return state.concat({
        timeSignature: '4/4',
        notes: []
      });

    case CHANGE_NOTE_LENGTH:
      return changeNoteLength(state, action.index, action.duration);

    case INSERT_NOTE:
      return insertNote(state, action.index);

    case CHANGE_TIME_SIGNATURE:
      return state.map((measure, i) => {
        if(i === action.measureIndex) {
          return {
            timeSignature: action.timeSignature,
            notes: measure.notes
          };
        }

        return measure;
      });

    case TOGGLE_NOTE_DOTTED:
      return toggleNoteDotted(state, action.index);

    default:
      return state;
  }
}
