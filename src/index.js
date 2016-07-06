import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from './containers/Root';
import configureStore from './util/configureStore';
import { replaceBpm } from './util';
import track from '../data/song';

const scoreBox = {
  x: 270,
  y: 5,
  width: window.innerWidth - 270
};

const trackWithBpm = {
  ...track,
  measures: replaceBpm(track.measures)
};

const store = configureStore({
  tracks: [trackWithBpm],
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
  scoreBox
});

const rootElement = document.getElementById('root');
render(<AppContainer component={Root} props={{ store }} />, rootElement);

if(module.hot) {
  module.hot.accept('./containers/Root', () => {
    render(<AppContainer component={require('./containers/Root').default} props={{ store }} />, rootElement);
  });
}
