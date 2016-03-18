import React from 'react';
import { render } from 'react-dom';

import Root from './containers/Root';
import configureStore from './util/configureStore';
import { prepareRows, defaultBpm } from './util';
import track from '../data/song';

const trackWithWidths = {
  ...track,
  measures: prepareRows(defaultBpm(track.measures), 'linear')
};

const store = configureStore({
  tracks: [trackWithWidths],
  currentTrackIndex: 0,
  clipboard: null,
  metronome: false
});

render(
  <Root store={store} />,
  document.getElementById('root')
);
