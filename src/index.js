import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './components/App';
import configureStore from './util/configureStore';
import song from './song';

const store = configureStore({ song });

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
