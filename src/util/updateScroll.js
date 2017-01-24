/* @flow */

import { uniqBy } from 'lodash';
import type { PlayingIndex, Layout, ScoreBox } from './stateTypes';

export function getXOfCurrentNote(playingIndex: PlayingIndex, measures: Array<Object>): number {
  const { measureIndex, noteIndex } = playingIndex;

  const note = measures[measureIndex].notes[noteIndex];
  const xOfMeasures = measures.reduce(
    (acc, curr, i) => {
      if (i >= measureIndex) {
        return acc;
      }
      return acc + curr.width;
    },
    0
  );

  return xOfMeasures + note.x;
}

export function getYOfCurrentNote(
  playingIndex: PlayingIndex,
  measures: Array<Object>,
  stringCount: number
): number {
  const rowSamples = uniqBy(measures.slice(0, playingIndex.measureIndex + 1), 'rowIndex');

  return rowSamples.reduce(
    (acc, measure) => {
      return acc + (measure.yTop + measure.yBottom + 75 + stringCount * 20);
    },
    0
  );
}

export function updateScrollPosition(
  playingIndex: PlayingIndex,
  measures: Array<Object>,
  layout: Layout,
  stringCount: number,
  scoreBox: ScoreBox
): void {
  if (layout === 'linear') {
    const x = getXOfCurrentNote(playingIndex, measures);

    if (x > window.innerWidth - scoreBox.x + window.scrollX - 100) {
      window.scroll(x - 100, 0);
    }
  } else {
    const y = getYOfCurrentNote(playingIndex, measures, stringCount);

    if (y > window.innerHeight + window.scrollY - 270) {
      window.scroll(0, y - 250);
    }
  }
}
