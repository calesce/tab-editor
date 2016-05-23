import { trackWithRows, linearTrack, computeTrackLayout } from './scoreLayout';

export const prepareTrack = (track, layout, scoreBox) => {
  return {
    ...track,
    measures: prepareRows(track.measures, layout, scoreBox)
  };
};

const prepareRows = (measures, layout, scoreBox) => {
  return layout === 'page' ?
    trackWithRows(computeTrackLayout(measures), scoreBox) :
    linearTrack(computeTrackLayout(measures));
};

export const replaceBpm = (measures) => {
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
