import { ActionTypes } from 'redux-undo';
import { SET_PLAYING_INDEX, TOGGLE_METRONOME, TOGGLE_COUNTDOWN } from '../actions/playingIndex';
import { COPY_NOTE, CUT_NOTE } from '../actions/cutCopyPaste';
import { INSERT_TRACK, DELETE_TRACK, SELECT_TRACK, CHANGE_LAYOUT, REPLACE_SONG, RESIZE } from '../actions/tracks';
import { SET_CURSOR, MOVE_CURSOR_LEFT, MOVE_CURSOR_RIGHT,
    MOVE_CURSOR_UP, MOVE_CURSOR_DOWN, SET_SELECT_RANGE } from '../actions/cursor';
import { DELETE_MEASURE } from '../actions/track';
import { DELETE_NOTE, INSERT_NOTE } from '../actions/measure';

import tracksReducer from './tracks';
import cursorReducer from './cursor';

const defaultCursor = {
  measureIndex: 0,
  noteIndex: 0,
  stringIndex: 0
};

const emptyTrack = (tracks, currentTrackIndex) => {
  return {
    instrument: tracks[currentTrackIndex].instrument,
    tuning: tracks[currentTrackIndex].tuning,
    measures: tracks[currentTrackIndex].measures.map((measure) => ({
      bpm: measure.bpm,
      timeSignature: measure.timeSignature,
      notes: []
    }))
  };
};

const getValidCursor = (cursor, track) => {
  let { measureIndex, noteIndex } = cursor;
  if(measureIndex > track.measures.length - 1) {
    measureIndex = track.measures.length - 1;
    noteIndex = track.measures[measureIndex].notes.length - 1;
  } else if(noteIndex > track.measures[measureIndex].notes.length - 1) {
    noteIndex = track.measures[measureIndex].notes.length - 1;
  }
  return {
    ...cursor,
    measureIndex,
    noteIndex
  };
};

export default function rootReducer(state = {}, action) {
  switch(action.type) {
    case TOGGLE_METRONOME: {
      return {
        ...state,
        metronome: !state.metronome
      };
    }

    case TOGGLE_COUNTDOWN: {
      return {
        ...state,
        countdown: !state.countdown
      };
    }

    case SET_PLAYING_INDEX: {
      return {
        ...state,
        playingIndex: action.index
      };
    }

    case COPY_NOTE: {
      return {
        ...state,
        clipboard: action.selection
      };
    }

    case CUT_NOTE: {
      return {
        ...state,
        clipboard: action.selection,
        tracks: tracksReducer(state.tracks, action, state.currentTrackIndex, state.layout, state.scoreBox)
      };
    }

    case CHANGE_LAYOUT: {
      return {
        ...state,
        layout: action.layout,
        tracks: tracksReducer(state.tracks, action, state.currentTrackIndex, action.layout, state.scoreBox)
      };
    }

    case RESIZE: {
      const scoreBox = {
        ...state.scoreBox,
        width: window.innerWidth - 270
      };

      return {
        ...state,
        scoreBox,
        tracks: tracksReducer(state.tracks, action, state.currentTrackIndex, state.layout, scoreBox)
      };
    }

    case REPLACE_SONG: {
      return {
        ...state,
        currentTrackIndex: 0,
        cursor: defaultCursor,
        tracks: tracksReducer(state.tracks, action ,0, state.layout, state.scoreBox)
      };
    }

    case INSERT_TRACK: {
      const newTrack = emptyTrack(state.tracks.present, state.currentTrackIndex);
      return {
        ...state,
        tracks: tracksReducer(
          state.tracks, action, state.tracks.present.length, state.layout, state.scoreBox,
          state.tracks.present.concat(newTrack)
        ),
        currentTrackIndex: state.tracks.present.length,
        cursor: defaultCursor
      };
    }

    case DELETE_TRACK: {
      const newTracks = state.tracks.present.length === 1 ?
        [emptyTrack(state.tracks.present, state.currentTrackIndex)] :
        state.tracks.present.filter((_, i) => state.currentTrackIndex !== i);

      return {
        ...state,
        tracks: tracksReducer(state.tracks, action, 0, state.layout, state.scoreBox, newTracks),
        currentTrackIndex: 0,
        cursor: defaultCursor
      };
    }

    case SELECT_TRACK: {
      return {
        ...state,
        tracks: tracksReducer(state.tracks, action, action.index, state.layout, state.scoreBox),
        currentTrackIndex: action.index,
        cursor: defaultCursor
      };
    }

    case SET_SELECT_RANGE: {
      return {
        ...state,
        selectRange: action.range,
        cursor: cursorReducer(state.cursor, action)
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
        cursor: cursorReducer(state.cursor, action, currentTrack.measures, currentTrack.tuning)
      };
    }

    case INSERT_NOTE:
    case DELETE_NOTE:
    case DELETE_MEASURE: {
      const currentTrack = state.tracks.present[state.currentTrackIndex];
      const cursor = cursorReducer(state.cursor, action, currentTrack.measures, currentTrack.tuning);

      return {
        ...state,
        cursor,
        tracks: tracksReducer(state.tracks, action, state.currentTrackIndex, state.layout, state.scoreBox)
      };
    }

    case ActionTypes.UNDO:
    case ActionTypes.REDO: {
      const tracks = tracksReducer(state.tracks, action, state.currentTrackIndex, state.layout, state.scoreBox);
      return {
        ...state,
        tracks,
        selectRange: undefined,
        cursor: getValidCursor(state.cursor, tracks.present[state.currentTrackIndex])
      };
    }

    default: {
      return {
        ...state,
        tracks: tracksReducer(state.tracks, action, state.currentTrackIndex, state.layout, state.scoreBox)
      };
    }
  }
}
