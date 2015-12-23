import tracks from './tracks';

export default function rootReducer(state = {}, action) {
  return tracks(state, action);
}
