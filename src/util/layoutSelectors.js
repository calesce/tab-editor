import { createSelector } from 'reselect';
import { prepareRowLayout } from './scoreLayout';
import { scoreBoxSelector, layoutSelector, tuningSelector } from './selectors';

const trackMeasuresSelector = state =>  state.tracks.present[state.currentTrackIndex].measures;

const calcHeight = (measures, tuning) => {
  return (measures[measures.length - 1].rowIndex + 1) * (210 + 20 * tuning.length);
};

const calcWidth = (measures) => {
  return measures.reduce((width, measure) => {
    return measure.width + width;
  }, 20);
};

export const trackWithLayoutSelector = createSelector(
  layoutSelector,
  trackMeasuresSelector,
  scoreBoxSelector,
  (layout, measures, scoreBox) => prepareRowLayout(measures, layout, scoreBox)
);

export const scoreSelector = createSelector(
  layoutSelector,
  tuningSelector,
  trackWithLayoutSelector,
  scoreBoxSelector,
  (layout, tuning, measures, { x, y, width }) => {
    return {
      measures,
      rowHeight: 20 * tuning.length + 210,
      height: layout === 'linear' ? '99%' : calcHeight(measures, tuning),
      width: layout === 'linear' ? calcWidth(measures) : width,
      x, y
    };
  }
);
