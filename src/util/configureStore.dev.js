import { createStore, compose } from 'redux';
import { persistState } from 'redux-devtools';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';
import undoable, { excludeAction } from 'redux-undo';

import * as types from '../actions/types';

const finalCreateStore = compose(
  DevTools.instrument(),
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&]+)\b/
    )
  )
)(createStore);

const ignoredTypes = [types.SET_PLAYING_INDEX, types.SET_CURSOR, types.SET_SELECT_RANGE, types.RESIZE,
 types.MOVE_CURSOR_UP, types.MOVE_CURSOR_DOWN, types.MOVE_CURSOR_LEFT, types.MOVE_CURSOR_RIGHT ];
const undoableReducer = undoable(rootReducer, { filter: excludeAction(ignoredTypes) });

export default function configureStore(initialState) {
  const store = finalCreateStore(undoableReducer, initialState);

  if(module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = undoable(require('../reducers').default, { filter: excludeAction(ignoredTypes) });
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
