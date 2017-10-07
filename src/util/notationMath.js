/* @flow */

const MIDDLE_OF_STAFF = 28;

export const determineFlip = (
  note: Object,
  yToUse: number,
  yOffset: number
): boolean => {
  const midY = MIDDLE_OF_STAFF + yOffset;
  if (note.string.length > 1) {
    const furthestFromMiddle = note.notes.reduce((max, next) => {
      return Math.abs(max - midY) > Math.abs(next.y - midY) ? max : next.y;
    }, midY);
    return furthestFromMiddle <= midY;
  }
  return yToUse <= midY;
};
