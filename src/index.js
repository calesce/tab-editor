import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from './containers/Root';
import configureStore from './util/configureStore';
import { replaceBpm } from './util';
import track from '../data/song';

import 'react-select/dist/react-select.css';

const initialState = {
  tracks: [{
    ...track,
    measures: replaceBpm(track.measures)
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
render(
  <AppContainer>
    <Root store={store}/>
  </AppContainer>,
  rootElement
);

if(module.hot) {
  module.hot.accept('./containers/Root', () => {
    let NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store}/>
      </AppContainer>,
      rootElement);
  });
}
