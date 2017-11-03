/* @flow */

import { ActionTypes } from 'redux-undo';
import {
  SET_PLAYING_INDEX,
  TOGGLE_METRONOME,
  TOGGLE_COUNTDOWN
} from '../actions/playingIndex';
import { COPY_NOTE, CUT_NOTE } from '../actions/cutCopyPaste';
import {
  INSERT_TRACK,
  DELETE_TRACK,
  SELECT_TRACK,
  CHANGE_LAYOUT,
  REPLACE_SONG
} from '../actions/tracks';
import {
  SET_CURSOR,
  MOVE_CURSOR_LEFT,
  MOVE_CURSOR_RIGHT,
  MOVE_CURSOR_UP,
  MOVE_CURSOR_DOWN,
  SET_SELECT_RANGE
} from '../actions/cursor';
import { DELETE_MEASURE } from '../actions/track';
import { DELETE_NOTE, INSERT_NOTE } from '../actions/measure';

import type { State, Track, Cursor } from '../util/stateTypes';

import tracksReducer from './tracks';
import cursorReducer from './cursor';

const defaultCursor = { measureIndex: 0, noteIndex: 0, stringIndex: 0 };

const emptyTrack = (tracks: Array<Track>, currentTrackIndex: number): Track => {
  return {
    instrument: tracks[currentTrackIndex].instrument,
    tuning: tracks[currentTrackIndex].tuning,
    measures: tracks[currentTrackIndex].measures.map(measure => ({
      repeatBegin: measure.repeatBegin,
      repeatEnd: measure.repeatEnd,
      tempo: measure.tempo,
      timeSignature: measure.timeSignature,
      notes: []
    }))
  };
};

const getValidCursor = (cursor: Cursor, track: Track): Cursor => {
  let { measureIndex, noteIndex } = cursor;
  if (measureIndex > track.measures.length - 1) {
    measureIndex = track.measures.length - 1;
    noteIndex = track.measures[measureIndex].notes.length - 1;
  } else if (noteIndex > track.measures[measureIndex].notes.length - 1) {
    noteIndex = track.measures[measureIndex].notes.length - 1;
  }
  return { ...cursor, measureIndex, noteIndex };
};

const getValidTrackIndex = (
  prevTrackIndex: number,
  tracks: Array<Track>
): number => {
  return tracks[prevTrackIndex] ? prevTrackIndex : tracks.length - 1;
};

export default function rootReducer(state: State, action: Object): State {
  switch (action.type) {
    case TOGGLE_METRONOME: {
      return { ...state, metronome: !state.metronome };
    }

    case TOGGLE_COUNTDOWN: {
      return { ...state, countdown: !state.countdown };
    }

    case SET_PLAYING_INDEX: {
      return { ...state, playingIndex: action.index };
    }

    case COPY_NOTE: {
      return { ...state, clipboard: action.selection };
    }

    case CUT_NOTE: {
      return {
        ...state,
        clipboard: action.selection,
        tracks: tracksReducer(state.tracks, action, state.currentTrackIndex)
      };
    }

    case CHANGE_LAYOUT: {
      return { ...state, layout: action.layout };
    }

    case REPLACE_SONG: {
      return {
        ...state,
        currentTrackIndex: 0,
        cursor: defaultCursor,
        tracks: tracksReducer(state.tracks, action, 0)
      };
    }

    case INSERT_TRACK: {
      const newTrack = emptyTrack(
        state.tracks.present,
        state.currentTrackIndex
      );
      return {
        ...state,
        tracks: tracksReducer(
          state.tracks,
          action,
          state.tracks.present.length,
          state.tracks.present.concat(newTrack)
        ),
        currentTrackIndex: state.tracks.present.length,
        cursor: defaultCursor
      };
    }

    case DELETE_TRACK: {
      const newTracks =
        state.tracks.present.length === 1
          ? [emptyTrack(state.tracks.present, state.currentTrackIndex)]
          : state.tracks.present.filter(
              (_, i) => state.currentTrackIndex !== i
            );

      return {
        ...state,
        tracks: tracksReducer(state.tracks, action, 0, newTracks),
        currentTrackIndex: 0,
        cursor: defaultCursor
      };
    }

    case SELECT_TRACK: {
      return {
        ...state,
        tracks: tracksReducer(state.tracks, action, action.index),
        currentTrackIndex: action.index,
        cursor: defaultCursor
      };
    }

    case SET_SELECT_RANGE: {
      const currentTrack = state.tracks.present[state.currentTrackIndex];
      return {
        ...state,
        selectRange: action.range,
        cursor: cursorReducer(
          state.cursor,
          action,
          currentTrack.measures,
          currentTrack.tuning
        )
      };
    }

    case SET_CURSOR:
    case MOVE_CURSOR_LEFT:
    case MOVE_CURSOR_RIGHT:
    case MOVE_CURSOR_UP:
    case MOVE_CURSOR_DOWN: {
      const currentTrack = state.tracks.present[state.currentTrackIndex];
      return {
        ...state,
        cursor: cursorReducer(
          state.cursor,
          action,
          currentTrack.measures,
          currentTrack.tuning
        )
      };
    }

    case INSERT_NOTE:
    case DELETE_NOTE:
    case DELETE_MEASURE: {
      const currentTrack = state.tracks.present[state.currentTrackIndex];
      const cursor = cursorReducer(
        state.cursor,
        action,
        currentTrack.measures,
        currentTrack.tuning
      );

      return {
        ...state,
        cursor,
        tracks: tracksReducer(state.tracks, action, state.currentTrackIndex)
      };
    }

    case ActionTypes.UNDO:
    case ActionTypes.REDO: {
      const tracks = tracksReducer(
        state.tracks,
        action,
        state.currentTrackIndex
      );
      const trackIndex = getValidTrackIndex(
        state.currentTrackIndex,
        tracks.present
      );

      return {
        ...state,
        tracks,
        selectRange: undefined,
        currentTrackIndex: trackIndex,
        cursor: getValidCursor(state.cursor, tracks.present[trackIndex])
      };
    }

    default: {
      return {
        ...state,
        tracks: tracksReducer(state.tracks, action, state.currentTrackIndex)
      };
    }
  }
}
