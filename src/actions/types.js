/* @flow */

import type {
  PlayingIndex,
  Clipboard,
  Cursor,
  Range,
  SelectRange,
  Duration,
  Tuning,
  TimeSignature,
  Layout,
  Track
} from '../util/stateTypes';

export type Action =
  | { type: 'SET_CURSOR', index: Cursor }
  | { type: 'MOVE_CURSOR_LEFT' }
  | { type: 'MOVE_CURSOR_RIGHT' }
  | { type: 'MOVE_CURSOR_UP' }
  | { type: 'MOVE_CURSOR_DOWN' }
  | { type: 'SET_SELECT_RANGE', range: SelectRange }
  | {
      type: 'CUT_NOTE',
      index: PlayingIndex,
      selection: Clipboard,
      range: ?Range
    }
  | { type: 'COPY_NOTE', selection: Clipboard }
  | { type: 'PASTE_NOTE', index: PlayingIndex, clipboard: Clipboard }
  | { type: 'CHANGE_NOTE', index: PlayingIndex, fret: number }
  | { type: 'DELETE_NOTE', index: PlayingIndex }
  | { type: 'CHANGE_NOTE_LENGTH', index: PlayingIndex, duration: Duration }
  | { type: 'INSERT_NOTE', index: PlayingIndex }
  | { type: 'MAKE_NOTE_REST', index: PlayingIndex }
  | { type: 'TOGGLE_NOTE_DOTTED', index: PlayingIndex }
  | { type: 'TOGGLE_NOTE_TREMOLO', index: PlayingIndex }
  | { type: 'TOGGLE_NOTE_VIBRATO', index: PlayingIndex }
  | { type: 'TOGGLE_NOTE_TRILL', index: PlayingIndex }
  | { type: 'SET_NOTE_TUPLET', index: PlayingIndex, tuplet: ?string }
  | { type: 'INCREASE_NOTE_LENGTH', index: PlayingIndex }
  | { type: 'DECREASE_NOTE_LENGTH', index: PlayingIndex }
  | { type: 'TOGGLE_REPEAT_BEGIN', index: PlayingIndex }
  | { type: 'TOGGLE_REPEAT_END', index: PlayingIndex }
  | { type: 'SET_PLAYING_INDEX', index: PlayingIndex }
  | { type: 'TOGGLE_METRONOME' }
  | { type: 'TOGGLE_COUNTDOWN' }
  | { type: 'INSERT_MEASURE', index: PlayingIndex }
  | { type: 'DELETE_MEASURE', measureIndex: number }
  | { type: 'CHANGE_TUNING', tuning: Tuning }
  | {
      type: 'CHANGE_TEMPO',
      index: PlayingIndex,
      tempo: number,
      toEnd: boolean,
      all: boolean
    }
  | {
      type: 'CHANGE_TIME_SIGNATURE',
      index: PlayingIndex,
      timeSignature: TimeSignature,
      toEnd: boolean,
      all: boolean
    }
  | { type: 'SET_INSTRUMENT', instrument: string }
  | { type: 'INSERT_TRACK' }
  | { type: 'DELETE_TRACK', index: PlayingIndex }
  | { type: 'SELECT_TRACK', index: PlayingIndex }
  | { type: 'CHANGE_LAYOUT', layout: Layout }
  | { type: 'REPLACE_SONG', tracks: Array<Track> };
