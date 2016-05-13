export const determineFlip = (note, yToUse) => {
  if(note.string.length > 1) {
    const furthestFromMiddle = note.notes.reduce((max, next) => {
      return Math.abs(max - 93) > Math.abs(next.y - 93) ? max : next.y;
    }, 93);
    return furthestFromMiddle <= 93;
  }
  return yToUse <= 93;
};
