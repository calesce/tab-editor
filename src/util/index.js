/* @flow */
import { trackWithRows, linearTrack, computeTrackLayout, ScoreBox } from './scoreLayout';

export const prepareTrack = (track: Object, layout: string, scoreBox: ScoreBox): Object => ({
  ...track,
  measures: prepareRowLayout(track.measures, layout, scoreBox)
});

const prepareRowLayout = (measures: Array<Object>, layout: string, scoreBox: ScoreBox): Array<Object> => {
  return layout === 'page' ?
    trackWithRows(computeTrackLayout(measures), scoreBox) :
    linearTrack(computeTrackLayout(measures));
};

export const replaceBpm = (measures: Array<Object>): Array<Object> => {
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
