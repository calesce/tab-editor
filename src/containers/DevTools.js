import React from 'react';
import { createDevTools } from 'redux-devtools';
import { ImportExportMonitor } from 'redux-import-export-monitor';
// import SliderMonitor from 'redux-slider-monitor';
// import DockMonitor from 'redux-devtools-dock-monitor';

export default createDevTools(<ImportExportMonitor />);
