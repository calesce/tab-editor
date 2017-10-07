/* @flow */

import type { Measure } from './stateTypes';

export const replaceTempo = (measures: Array<Measure>): Array<Measure> => {
  return measures.reduce((endMeasures, measure, i) => {
    if (measure.tempo) {
      return endMeasures.concat(measure);
    } else if (i === 0) {
      measure = { ...measure, tempo: 120 };
      return endMeasures.concat(measure);
    }

    const prevMeasure = endMeasures[i - 1];
    measure = { ...measure, tempo: prevMeasure.tempo };
    return endMeasures.concat(measure);
  }, []);
};
