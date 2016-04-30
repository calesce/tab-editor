export const getNextNote = (measures, { stringIndex, measureIndex, noteIndex }) => {
  if(noteIndex >= measures[measureIndex].notes.length - 1) {
    return {
      measureIndex: measureIndex + 1,
      noteIndex: 0,
      stringIndex
    };
  } else {
    return {
      measureIndex,
      noteIndex: noteIndex + 1,
      stringIndex
    };
  }
};

export const getPrevNote = (measures, { stringIndex, measureIndex, noteIndex }) => {
  if(measureIndex === 0 && noteIndex === 0) {
    return { measureIndex, noteIndex, stringIndex };
  } else if(noteIndex === 0) {
    let prevMeasure = measures[measureIndex - 1];
    if(prevMeasure.notes.length > 0) {
      return {
        measureIndex: measureIndex - 1,
        noteIndex: measures[measureIndex - 1].notes.length - 1,
        stringIndex
      };
    } else {
      return {
        measureIndex: measureIndex - 1,
        noteIndex: 0,
        stringIndex
      };
    }
  } else {
    return {
      measureIndex,
      noteIndex: noteIndex - 1,
      stringIndex
    };
  }
};

export const getUpperString = (stringIndex, stringCount) => {
  return stringIndex === stringCount - 1 ? 0 : stringIndex + 1;
};

export const getLowerString = (stringIndex, stringCount) => {
  return stringIndex === 0 ? stringCount - 1 : stringIndex - 1;
};

export const cursorAfterCutting = (measures, selectRange, oldCursor) => {
  const firstMeasureIndex = parseInt(Object.keys(selectRange)[0]);

  let measureIndex = firstMeasureIndex;
  let noteIndex;
  if(selectRange[firstMeasureIndex] === 'all') {
    const lastMeasure = Object.keys(selectRange)[Object.keys(selectRange).length - 1];
    if(parseInt(lastMeasure) === measures.length - 1) {
      measureIndex = firstMeasureIndex - 1;
    }
    if(Object.keys(selectRange).length === 1) {
      noteIndex = 0;
    }
  }

  if(noteIndex === undefined) {
    noteIndex = Object.keys(selectRange).length > 1 ? 0 : selectRange[measureIndex][0];
  }

  return {
    ...oldCursor,
    noteIndex: noteIndex === 0 ? 0 : noteIndex - 1,
    measureIndex
  };
};
