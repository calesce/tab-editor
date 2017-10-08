import { createSelector } from 'reselect';
import { prepareRowLayout } from '../scoreLayout';
import { layoutSelector, tuningSelector, trackMeasuresSelector } from './index';

export const trackWithLayoutSelector = createSelector(
  [layoutSelector, trackMeasuresSelector, tuningSelector],
  (layout, measures, tuning) => prepareRowLayout(measures, layout, tuning)
);

export const makeScoreSelector = () => {
  return createSelector(
    [trackWithLayoutSelector, layoutSelector, tuningSelector],
    (measures, layout, tuning) => {
      return {
        measures,
        tuning,
        layout
      };
    }
  );
};
