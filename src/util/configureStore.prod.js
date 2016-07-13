/* @flow */
import { createStore } from 'redux';
import rootReducer from '../reducers';

import type { State } from './stateTypes';

export default function configureStore(initialState: State) {
  return createStore(rootReducer, initialState);
}
