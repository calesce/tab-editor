import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import configureStore from './util/configureStore';
import { replaceTempo } from './util';
import track from '../data/song';

import './default.css';
import 'react-select/dist/react-select.css';
import 'babel-polyfill';

const initialState = {
  tracks: [{
    ...track,
    measures: replaceTempo(track.measures)
  }],
  layout: 'page',
  currentTrackIndex: 0,
  clipboard: null,
  playingIndex: null,
  cursor: {
    measureIndex: 0,
    noteIndex: 0,
    stringIndex: 0
  },
  metronome: false,
  countdown: false,
  scoreBox: {
    x: 270,
    y: 5,
    width: window.innerWidth - 270
  }
};

const store = configureStore(initialState);
const rootElement = document.getElementById('root');

const renderApp = () => {
  const App = require('./containers/App').default;
  render(
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>,
    rootElement
  );
};
renderApp();

if(module.hot) {
  module.hot.accept('./containers/App', () => renderApp());
}
