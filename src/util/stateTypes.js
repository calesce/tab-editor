/* @flow */

export type Cursor = {
  measureIndex: number,
  noteIndex: number,
  stringIndex: number
};
export type PlayingIndex = { measureIndex: number, noteIndex: number };
export type Tuning = Array<string>;
export type TimeSignature = { beats: number, beatType: number };
export type Layout = 'page' | 'linear';
export type Duration = 'w' | 'h' | 'q' | 'e' | 's' | 't';

export type Note = {
  string: Array<number>,
  fret: Array<number>,
  duration: Duration,
  dotted?: boolean,
  tremolo?: boolean,
  trill?: boolean,
  vibrato?: boolean,
  tuplet?: string
};

export type Measure = {
  repeatBegin?: boolean,
  repeatEnd?: boolean,
  tempo: number,
  timeSignature: TimeSignature,
  notes: Array<Note>
};

export type Track = {
  instrument: string,
  tuning: Tuning,
  measures: Array<Measure>
};

export type UndoableTracks = {
  past: Array<Array<Track>>,
  present: Array<Track>,
  future: Array<Array<Track>>
};

export type Clipboard = Note | { notes: Array<Note> } | Array<Measure>;
export type Range = { [key: string]: number | 'all' | Array<number> };
export type SelectRange = { [key: number]: 'all' | Array<number> };

export type State = {
  clipboard?: Clipboard,
  countdown: boolean,
  currentTrackIndex: number,
  cursor: Cursor,
  layout: Layout,
  metronome: boolean,
  playingIndex: PlayingIndex,
  selectRange: SelectRange,
  tracks: UndoableTracks
};
