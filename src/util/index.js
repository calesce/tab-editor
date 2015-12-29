const computeMeasureWidths = (track) => {
  return track.map((measure, index) => {
    let width = 55 * measure.notes.length;
    if(measure.notes.length === 0) {
      width = 40;
    }
    if(index === 0) {
      width += 15;
    }

    let prevMeasure = track[index-1];
    if(prevMeasure && prevMeasure.timeSignature === measure.timeSignature) {
      return {
        ...measure,
        width
      };
    }
    width += 30;
    if(measure.notes.length === 0) {
      width += 20;
    }

    return {
      ...measure,
      width,
      renderTimeSignature: true
    };
  });
};

const trackWithRows = (track) => {
  return track.reduce((newTrack, measure, index) => {
    if(index === 0) {
      return [{
        ...measure,
        rowIndex: index
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
    if(currentRowWidth + measure.width >= window.innerWidth - 9) {
      newRowIndex = currentRow + 1;
    }

    return newTrack.concat({
      ...measure,
      rowIndex: newRowIndex
    });
  }, []);
};

export function prepareRows(track) {
  return trackWithRows(computeMeasureWidths(track));
}

export function defaultBpm(measures) {
  return measures.map((measure) => ({
    ...measure,
    bpm: 120
  }));
}
