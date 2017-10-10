/* @flow */

import { uniqBy } from 'lodash';
import type { PlayingIndex, Layout } from './stateTypes';

export function getXOfCurrentNote(
  playingIndex: PlayingIndex,
  measures: Array<Object>
): number {
  const { measureIndex, noteIndex } = playingIndex;

  const note = measures[measureIndex].notes[noteIndex];
  const xOfMeasures = measures.reduce((acc, curr, i) => {
    if (i >= measureIndex) {
      return acc;
    }
    return acc + curr.width;
  }, 0);

  return xOfMeasures + note.x;
}

export function getYOfCurrentNote(
  playingIndex: PlayingIndex,
  measures: Array<Object>,
  stringCount: number
): number {
  const rowSamples = uniqBy(
    measures.slice(0, playingIndex.measureIndex + 1),
    'rowIndex'
  );

  return rowSamples.reduce((acc, measure) => {
    return acc + (measure.yTop + measure.yBottom + 75 + stringCount * 20);
  }, 0);
}

export function updateScrollPosition(
  playingIndex: PlayingIndex,
  measures: Array<Object>,
  layout: Layout,
  stringCount: number,
  domElement: Element
): void {
  if (layout === 'linear') {
    const x = getXOfCurrentNote(playingIndex, measures);

    if (x > domElement.clientWidth - 270 + domElement.scrollLeft - 100) {
      domElement.scrollLeft = x - 100;
    }
  } else {
    const y = getYOfCurrentNote(playingIndex, measures, stringCount);

    if (y > domElement.clientHeight + domElement.scrollTop - 270) {
      domElement.scrollTop = y - 250;
    }
  }
}
