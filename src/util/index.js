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
    if(prevMeasure && prevMeasure.timeSignature === measure.timeSignature) {
      if(prevMeasure.bpm !== measure.bpm) {
        showBpm = true;
      }

      return {
        ...measure,
        width,
        renderTimeSignature: false,
        showBpm
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
      showBpm
    };
  });
};

const trackWithRows = (track) => {
  return track.reduce((newTrack, measure, index) => {
    if(index === 0) {
      return [{
        ...measure,
        rowIndex: index,
        indexOfRow: 0
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
    if(currentRowWidth + measure.width >= window.innerWidth - 9) {
      newRowIndex = currentRow + 1;
      indexOfRow = 0;
    }

    return newTrack.concat({
      ...measure,
      rowIndex: newRowIndex,
      indexOfRow
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

export function prepareRows(measures, layout) {
  return layout === 'page' ?
    trackWithRows(computeMeasureWidths(measures)) :
    linearTrack(computeMeasureWidths(measures));
}

export function prepareTrack(track, layout) {
  return {
    ...track,
    measures: prepareRows(track.measures, layout)
  };
}

export function defaultBpm(measures) {
  return measures.map((measure) => ({
    ...measure,
    bpm: 120
  }));
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
