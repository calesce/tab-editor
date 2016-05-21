import { SET_PLAYING_INDEX } from '../actions/playingIndex';

export default function playingIndex(state, action) {
  switch(action.type) {
    case SET_PLAYING_INDEX:
      return action.index;
    default:
      return state;
  }
}
