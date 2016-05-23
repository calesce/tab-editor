import { createStore } from 'redux';
import rootReducer from '../reducers';
import { getUndoableReducer } from './undoable';

export default function configureStore(initialState) {
  return createStore(getUndoableReducer(rootReducer), initialState);
}
