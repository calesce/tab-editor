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
