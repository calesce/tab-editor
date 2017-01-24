/* @flow */

import { createStore } from 'redux';
import rootReducer from '../reducers';

import type { State } from './stateTypes';

export default function configureStore(initialState: State) {
  const store = createStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
