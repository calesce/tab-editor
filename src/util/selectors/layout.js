import { createSelector } from 'reselect';
import { prepareRowLayout } from '../scoreLayout';
import { scoreBoxSelector, layoutSelector, tuningSelector, trackMeasuresSelector } from './index';

const calcHeight = (measures, tuning) => {
  const rows = measures.reduce(
    (rows, measure) => {
      return measure.indexOfRow === 0 ? rows.concat(measure) : rows;
    },
    []
  );

  return rows.reduce(
    (sum, measure) => {
      return sum + 20 * tuning.length + (measure.yTop + measure.yBottom + 75);
    },
    0
  );
};

const calcWidth = measures => {
  return measures.reduce(
    (width, measure) => {
      return measure.width + width;
    },
    20
  );
};

export const trackWithLayoutSelector = createSelector(
  [ layoutSelector, trackMeasuresSelector, scoreBoxSelector, tuningSelector ],
  (layout, measures, scoreBox, tuning) => prepareRowLayout(measures, layout, scoreBox, tuning)
);

export const makeScoreSelector = () => {
  return createSelector(
    [ trackWithLayoutSelector, layoutSelector, tuningSelector, scoreBoxSelector ],
    (measures, layout, tuning, { x, y, width }) => {
      return {
        measures,
        tuning,
        height: layout === 'linear' ? '99%' : calcHeight(measures, tuning),
        width: layout === 'linear' ? calcWidth(measures) : width,
        x,
        y
      };
    }
  );
};
