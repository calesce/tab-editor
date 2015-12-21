import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './components/App';
import configureStore from './util/configureStore';
import track from './song';

const store = configureStore({ track });

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
