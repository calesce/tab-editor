import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from './containers/Root';
import configureStore from './util/configureStore';
import { prepareRows, replaceBpm } from './util';
import track from '../data/song';

const trackWithWidths = {
  ...track,
  measures: prepareRows(replaceBpm(track.measures), 'linear', { width: window.innerWidth - 10 })
};

const store = configureStore({
  tracks: [trackWithWidths],
  currentTrackIndex: 0,
  clipboard: null,
  metronome: false
});

const rootElement = document.getElementById('root');
render(<AppContainer component={Root} props={{ store }} />, rootElement);

if(module.hot) {
  module.hot.accept('./containers/Root', () => {
    render(<AppContainer component={require('./containers/Root').default} props={{ store }} />, rootElement);
  });
}
