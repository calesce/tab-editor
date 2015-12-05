import _ from 'lodash';
import theSong from '../song';
import { CHANGE_NOTE } from '../actions/types';

const initialState = theSong;

function changeNote(song, fret, index) {
  const { measureIndex, noteIndex, stringIndex } = index;

  let measure = _.cloneDeep(song[measureIndex]);
  let note = measure.notes[noteIndex];
  let currentStringIndex = _.findIndex(note.string, (note) => note === stringIndex);
  if(currentStringIndex === -1) {
    if(note.fret.length > 0) {
      note.duration.push('q');
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
  let newSong = _.cloneDeep(song);
  newSong[measureIndex] = measure;

  return newSong;
}

export default function song(state = initialState, action) {
  switch(action.type) {
    case CHANGE_NOTE:
      return changeNote(state, action.fret, action.index);

    default:
      return state;
  }
}
