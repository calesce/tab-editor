import React from 'react';
import { render } from 'react-dom';

import Root from './containers/Root';
import configureStore from './util/configureStore';
import { prepareRows, defaultBpm } from './util';
import track from './song';

const trackWithWidths = {
  ...track,
  measures: prepareRows(defaultBpm(track.measures))
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
