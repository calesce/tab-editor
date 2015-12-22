import React from 'react';
import { render } from 'react-dom';

import Root from './containers/Root';
import configureStore from './util/configureStore';
import track from './song';

const store = configureStore({ track });

render(
  <Root store={store} />,
  document.getElementById('root')
);
