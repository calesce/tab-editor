export function computeMeasureWidths(track) {
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
