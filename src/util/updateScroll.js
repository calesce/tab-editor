export function getXOfCurrentNote(playingIndex, measures) {
  const { measureIndex, noteIndex } = playingIndex;
  const xOfMeasures = measures.reduce((acc, curr, i) => {
    if(i >= measureIndex) {
      return acc;
    }
    return acc + curr.width;
  }, 0);

  return xOfMeasures + 55 * noteIndex;
}

export function getYOfCurrentNote(playingIndex, measures, stringCount) {
  const position = measures[playingIndex.measureIndex];
  return (position.rowIndex) * (27 * stringCount) + 50;
}

export function updateScrollPosition(playingIndex, measures, layout, stringCount) {
  if(layout === 'linear') {
    const x = getXOfCurrentNote(playingIndex, measures);
    const { scrollX, innerWidth } = window;

    if(x > innerWidth + scrollX - 200) {
      window.scroll(x - 200, 0);
    }
  } else {
    const y = getYOfCurrentNote(playingIndex, measures, stringCount);
    const { innerHeight, scrollY } = window;

    if(y > innerHeight + scrollY - 270) {
      window.scroll(0, y - 100);
    }
  }
}
