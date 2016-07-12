/* @flow */

import type { Measure } from './stateTypes';

export const replaceBpm = (measures: Array<Measure>): Array<Measure> => {
  return measures.reduce((endMeasures, measure, i) => {
    if(measure.bpm) {
      return endMeasures.concat(measure);
    } else if(i === 0) {
      measure = {
        ...measure,
        bpm: 120
      };
      return endMeasures.concat(measure);
    }

    const prevMeasure = endMeasures[i - 1];
    measure = {
      ...measure,
      bpm: prevMeasure.bpm
    };
    return endMeasures.concat(measure);
  }, []);
};
