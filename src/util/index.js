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

    const notes = measure.notes.map((note, i) => {
      return {
        ...note,
        x: calcXForNote(measure, i)
      };
    });

    let prevMeasure = track[index-1];
    if(prevMeasure && prevMeasure.timeSignature === measure.timeSignature) {
      if(prevMeasure.bpm !== measure.bpm) {
        showBpm = true;
      }

      return {
        ...measure,
        width,
        renderTimeSignature: false,
        showBpm,
        notes
      };
    }
    width += 30;
    if(measure.notes.length === 0) {
      width += 20;
    }



    return {
      ...measure,
      width,
      renderTimeSignature: true,
      showBpm,
      notes
    };
  });
};

const trackWithRows = (track, scoreBox) => {
  return track.reduce((newTrack, measure, index) => {
    if(index === 0) {
      return [{
        ...measure,
        rowIndex: index,
        indexOfRow: 0,
        xOfMeasure: 0
      }];
    }

    const currentRow = newTrack[index - 1].rowIndex;
    const currentRowWidth = newTrack.slice(0, index).reduce((accum, next) => {
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

    return newTrack.concat({
      ...measure,
      rowIndex: newRowIndex,
      indexOfRow,
      xOfMeasure: indexOfRow === 0 ? indexOfRow : currentRowWidth
    });
  }, []);
};

const linearTrack = (track) => {
  return track.map((measure, i) => {
    return {
      ...measure,
      rowIndex: 0,
      indexOfRow: i === 0 ? 0 : undefined
    };
  });
};

export function prepareRows(measures, layout, scoreBox) {
  return layout === 'page' ?
    trackWithRows(computeMeasureWidths(measures), scoreBox) :
    linearTrack(computeMeasureWidths(measures));
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
