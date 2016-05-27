import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from './containers/Root';
import configureStore from './util/configureStore';
import { prepareTrack, replaceBpm } from './util';
import track from '../data/song';

const scoreBox = {
  x: 270,
  y: 5,
  width: window.innerWidth - 270
};

const trackWithWidths = prepareTrack({
  ...track,
  measures: replaceBpm(track.measures)
}, 'linear', scoreBox);

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
  scoreBox
});

const rootElement = document.getElementById('root');
render(<AppContainer component={Root} props={{ store }} />, rootElement);

if(module.hot) {
  module.hot.accept('./containers/Root', () => {
    render(<AppContainer component={require('./containers/Root').default} props={{ store }} />, rootElement);
  });
}
