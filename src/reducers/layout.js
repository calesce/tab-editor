import { CHANGE_LAYOUT } from '../actions/types';

export default function layout(state = 'page', action) {
  switch(action.type) {
    case CHANGE_LAYOUT:
      return action.layout;
    default:
      return state;
  }
}
