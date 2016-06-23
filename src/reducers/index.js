import { SET_PLAYING_INDEX, TOGGLE_METRONOME, TOGGLE_COUNTDOWN } from '../actions/playingIndex';
import { COPY_NOTE, CUT_NOTE } from '../actions/cutCopyPaste';
import { INSERT_TRACK, DELETE_TRACK, SELECT_TRACK, CHANGE_LAYOUT, REPLACE_SONG, RESIZE } from '../actions/tracks';
import { SET_CURSOR, MOVE_CURSOR_LEFT, MOVE_CURSOR_RIGHT,
    MOVE_CURSOR_UP, MOVE_CURSOR_DOWN, SET_SELECT_RANGE } from '../actions/cursor';
import { DELETE_MEASURE } from '../actions/track';
import { DELETE_NOTE, INSERT_NOTE } from '../actions/measure';

import tracksReducer from './tracks';
import layoutReducer from './layout';
import cursorReducer from './cursor';

const defaultCursor = {
  measureIndex: 0,
  noteIndex: 0,
  stringIndex: 0
};

const emptyTrack = (tracks, currentTrackIndex) => {
  const currentTrack = tracks[currentTrackIndex];

  return {
    instrument: currentTrack.instrument,
    tuning: currentTrack.tuning,
    measures: currentTrack.measures.map((measure) => ({
      bpm: measure.bpm,
      timeSignature: measure.timeSignature,
      notes: []
    }))
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
        tracks: tracksReducer(state.tracks, state.currentTrackIndex, state.layout, state.scoreBox, action)
      };
    }

    case CHANGE_LAYOUT: {
      const layout = layoutReducer(state.layout, action);
      return {
        ...state,
        layout,
        tracks: tracksReducer(state.tracks, state.currentTrackIndex, layout, state.scoreBox, action)
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
        tracks: tracksReducer(state.tracks, state.currentTrackIndex, state.layout, scoreBox, action)
      };
    }

    case REPLACE_SONG: {
      return {
        ...state,
        currentTrackIndex: 0,
        cursor: defaultCursor,
        tracks: tracksReducer(state.tracks, 0, state.layout, state.scoreBox, action)
      }
    }

    case INSERT_TRACK: {
      const newTrack = emptyTrack(state.tracks, state.currentTrackIndex);

      return {
        ...state,
        tracks: tracksReducer(state.tracks.concat(newTrack), state.tracks.length, state.layout, state.scoreBox, action),
        currentTrackIndex: state.tracks.length,
        cursor: defaultCursor
      };
    }

    case DELETE_TRACK: {
      const newTracks = state.tracks.length === 1 ?
        [emptyTrack(state.tracks, state.currentTrackIndex)] :
        state.tracks.filter((_, i) => state.currentTrackIndex !== i);

      return {
        ...state,
        tracks: tracksReducer(newTracks, 0, state.layout, state.scoreBox, action),
        currentTrackIndex: 0,
        cursor: defaultCursor
      };
    }

    case SELECT_TRACK: {
      return {
        ...state,
        tracks: tracksReducer(state.tracks, action.index, state.layout, state.scoreBox, action),
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
      const currentTrack = state.tracks[state.currentTrackIndex];
      return {
        ...state,
        cursor: cursorReducer(state.cursor, action, currentTrack.measures, currentTrack.tuning)
      };
    }

    case INSERT_NOTE:
    case DELETE_NOTE:
    case DELETE_MEASURE: {
      const currentTrack = state.tracks[state.currentTrackIndex];
      const cursor = cursorReducer(state.cursor, action, currentTrack.measures, currentTrack.tuning);

      return {
        ...state,
        cursor,
        tracks: tracksReducer(state.tracks, state.currentTrackIndex, state.layout, state.scoreBox, action)
      }
    }

    default: {
      return {
        ...state,
        tracks: tracksReducer(state.tracks, state.currentTrackIndex, state.layout, state.scoreBox, action)
      };
    }
  }
}
