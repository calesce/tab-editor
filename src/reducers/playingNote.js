import { SET_PLAYING_NOTE } from '../actions/types';

export default function playingNote(state, action) {
  switch(action.type) {
    case SET_PLAYING_NOTE:
      return action.index;
    default:
      return state;
  }
}
