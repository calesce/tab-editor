import React from 'react';
import { createDevTools } from 'redux-devtools';
import SliderMonitor from 'redux-slider-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

export default createDevTools(
  <DockMonitor toggleVisibilityKey='ctrl-h'
             changePositionKey='ctrl-q'
             defaultPosition='bottom'
             defaultSize={0.15} defaultIsVisible={false}>
    <SliderMonitor keyboardEnabled />
  </DockMonitor>
);
