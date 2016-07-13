/* @flow */

export type Cursor = { measureIndex: number; noteIndex: number, stringIndex: number };
export type PlayingIndex = { measureIndex: number; noteIndex: number };
export type ScoreBox = { x: number; y: number, width: number };
export type Tuning = Array<string>;
export type TimeSignature = { beats: number, beatType: number };
export type Layout = 'page' | 'linear';

export type Note = {
  string: Array<number>,
  fret: Array<number>,
  duration: string
};

export type Measure = {
  bpm: number,
  timeSignature: TimeSignature,
  notes: Array<Object>
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

export type State = {
  clipboard?: Clipboard,
  countdown: boolean,
  currentTrackIndex: number,
  cursor: Cursor,
  layout: Layout,
  metronome: boolean,
  playingIndex: PlayingIndex,
  scoreBox: ScoreBox,
  tracks: UndoableTracks
};
