import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import App from './containers/App';

import configureStore from './util/configureStore';
import { replaceTempo } from './util';
import track from '../data/song';
import Redbox from 'redbox-react';

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);

import './default.css';
import 'react-select/dist/react-select.css';
import 'babel-polyfill';

const initialState = {
  tracks: [{ ...track, measures: replaceTempo(track.measures) }],
  layout: 'page',
  currentTrackIndex: 0,
  clipboard: null,
  playingIndex: null,
  cursor: { measureIndex: 0, noteIndex: 0, stringIndex: 0 },
  metronome: false,
  countdown: false
};

const store = configureStore(initialState);

const CustomErrorReporter = ({ error }) => <Redbox error={error} />;

const renderApp = () => {
  render(
    <AppContainer errorReporter={CustomErrorReporter}>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>,
    rootElement
  );
};
renderApp();

if (module.hot) {
  module.hot.accept('./containers/App', () => renderApp());
}
