import theSong from '../song';

const initialState = theSong;

export default function song(state = initialState, action) {
  switch(action.type) {
    case 'BLAH':
      return state;

    default:
      return state;
  }
}
