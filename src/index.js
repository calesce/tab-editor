import React from 'react';
import { render } from 'react-dom';

import Root from './containers/Root';
import configureStore from './util/configureStore';
import track from './song';

const store = configureStore({
  tracks: [track],
  currentTrackIndex: 0
});

render(
  <Root store={store} />,
  document.getElementById('root')
);
