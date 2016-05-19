import shallowEqual from 'react-pure-render/shallowEqual';
import { isEqual } from 'lodash';

const computeMeasureWidths = (track) => {
  return track.map((measure, index) => {
    let width = 59 * measure.notes.length;
    let showBpm = false;
    if(measure.notes.length === 0) {
      width = 40;
    }
    if(index === 0) {
      width += 15;
      showBpm = true;
    }

    let prevMeasure = track[index-1];
    if(prevMeasure && shallowEqual(prevMeasure.timeSignature, measure.timeSignature)) {
      if(prevMeasure.bpm !== measure.bpm) {
        showBpm = true;
      }

      const newMeasure = {
        ...measure,
        width,
        renderTimeSignature: false,
        showBpm
      };
      return isEqual(newMeasure, measure) ? measure : newMeasure;
    }
    width += 30;
    if(measure.notes.length === 0) {
      width += 20;
    }

    const newMeasure = {
      ...measure,
      width,
      renderTimeSignature: true,
      showBpm
    };
    return isEqual(newMeasure, measure) ? measure : newMeasure;
  });
};

const measuresWithXCoords = (track) => {
  return track.map(measure => {
    const newMeasure = {
      ...measure,
      notes: measure.notes.map((note, i) => ({
        ...note,
        x: calcXForNote(measure, i)
      }))
    };

    return isEqual(newMeasure, measure) ? measure : newMeasure;
  });
};

const trackWithRows = (measures, scoreBox) => {
  return measures.reduce((newMeasures, measure, index) => {
    if(index === 0) {
      const newMeasure = {
        ...measure,
        rowIndex: index,
        indexOfRow: 0,
        xOfMeasure: 0
      };
      return [isEqual(newMeasure, measure) ? measure : newMeasure];
    }

    const currentRow = newMeasures[index - 1].rowIndex;
    const currentRowWidth = newMeasures.slice(0, index).reduce((accum, next) => {
      if(next.rowIndex === currentRow) {
        return accum + next.width;
      }
      return accum;
    }, 0);

    let newRowIndex = currentRow;
    let indexOfRow;
    if(currentRowWidth + measure.width >= scoreBox.width) {
      newRowIndex = currentRow + 1;
      indexOfRow = 0;
    }

    const newMeasure = {
      ...measure,
      rowIndex: newRowIndex,
      indexOfRow,
      xOfMeasure: indexOfRow === 0 ? indexOfRow : currentRowWidth
    };

    return newMeasures.concat(isEqual(newMeasure, measure) ? measure : newMeasure);
  }, []);
};

const linearTrack = (track) => {
  return track.map((measure, i) => {
    const newMeasure = {
      ...measure,
      rowIndex: 0,
      indexOfRow: i === 0 ? 0 : undefined
    };
    return isEqual(newMeasure, measure) ? measure : newMeasure;
  });
};

export function prepareRows(measures, layout, scoreBox) {
  return layout === 'page' ?
    measuresWithXCoords(trackWithRows(computeMeasureWidths(measures), scoreBox)) :
    measuresWithXCoords(linearTrack(computeMeasureWidths(measures)));
}

export function prepareTrack(track, layout, scoreBox) {
  return {
    ...track,
    measures: prepareRows(track.measures, layout, scoreBox)
  };
}

export function replaceBpm(measures) {
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
}

export function calcXForNote(measure, noteIndex) {
  let x = 0 + (noteIndex * 53 + 33);
  if(measure.indexOfRow === 0) {
    x += 8;
  }
  if(measure.renderTimeSignature) {
    x += 30;
  }
  if(measure.notes.length === 0 && measure.indexOfRow !== 0) {
    x -= measure.renderTimeSignature ? 0 : 25;
  }
  return x;
}
