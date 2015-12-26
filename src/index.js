import React from 'react';
import { render } from 'react-dom';

import Root from './containers/Root';
import configureStore from './util/configureStore';
import { computeMeasureWidths } from './util';
import track from './song';

const trackWithWidths = {
  ...track,
  measures: computeMeasureWidths(track.measures)
};

const store = configureStore({
  tracks: [trackWithWidths],
  currentTrackIndex: 0,
  clipboard: null
});

render(
  <Root store={store} />,
  document.getElementById('root')
);
