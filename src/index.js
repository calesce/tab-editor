import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from './containers/Root';
import configureStore from './util/configureStore';
import { prepareTrack, replaceBpm } from './util';
import track from '../data/song';

const SCORE_WIDTH = window.innerWidth - 10;

const trackWithWidths = prepareTrack({
  ...track,
  measures: replaceBpm(track.measures)
}, 'linear', { width: 'SCORE_WIDTH'});

const store = configureStore({
  tracks: [trackWithWidths],
  layout: 'page',
  currentTrackIndex: 0,
  clipboard: null,
  cursor: {
    measureIndex: 0,
    noteIndex: 0,
    stringIndex: 0
  },
  metronome: false,
  width: SCORE_WIDTH
});

const rootElement = document.getElementById('root');
render(<AppContainer component={Root} props={{ store }} />, rootElement);

if(module.hot) {
  module.hot.accept('./containers/Root', () => {
    render(<AppContainer component={require('./containers/Root').default} props={{ store }} />, rootElement);
  });
}
