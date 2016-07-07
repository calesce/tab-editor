/* @flow */

import type { PlayingIndex } from './stateTypes';

export function getXOfCurrentNote({ measureIndex, noteIndex }: PlayingIndex, measures: Array<Object>): number {
  const xOfMeasures = measures.reduce((acc, curr, i) => {
    if(i >= measureIndex) {
      return acc;
    }
    return acc + curr.width;
  }, 0);

  return xOfMeasures + 55 * noteIndex;
}

export function getYOfCurrentNote(playingIndex: PlayingIndex, measures: Array<Object>, stringCount: number): number {
  const position = measures[playingIndex.measureIndex];
  return (position.rowIndex) * (27 * stringCount) + 50;
}

export function updateScrollPosition(playingIndex: PlayingIndex, measures: Array<Object>, layout: string, stringCount: number): void {
  if(layout === 'linear') {
    const x = getXOfCurrentNote(playingIndex, measures);
    let { scrollX, innerWidth } = window;

    if(x > innerWidth + scrollX - 200) {
      window.scroll(x - 200, 0);
    }
  } else {
    const y = getYOfCurrentNote(playingIndex, measures, stringCount);
    let { innerHeight, scrollY } = window;

    if(y > innerHeight + scrollY - 270) {
      window.scroll(0, y - 100);
    }
  }
}
