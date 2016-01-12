import track from './track';
import layout from './layout';
import playingNote from './playingNote';
import cursor from './cursor';
import { prepareRows } from '../util';
import { COPY_NOTE, CUT_NOTE, CHANGE_LAYOUT, INSERT_TRACK, DELETE_TRACK, SELECT_TRACK } from '../actions/types';

const replaceTrack = (tracks, action, currentTrackIndex, layout = 'page') => {
  return tracks.map((t, index) => {
    if(index === currentTrackIndex) {
      const newTrack = track(t, action);
      return {
        ...newTrack,
        measures: prepareRows(newTrack.measures, layout)
      };
    }
    return t;
  });
};

const defaultCursor = () => ({
  measureIndex: 0,
  noteIndex: 0,
  stringIndex: 0
});

const defaultTrack = (state) => ({
  instrument: state.tracks[state.currentTrackIndex].instrument,
  tuning: state.tracks[state.currentTrackIndex].tuning,
  measures: [
    {
      bpm: state.tracks[state.currentTrackIndex].measures[0].bpm,
      timeSignature: state.tracks[state.currentTrackIndex].measures[0].timeSignature,
      notes: []
    }
  ]
});

export default function tracks(state = {}, action) {
  switch(action.type) {
    case INSERT_TRACK: {
      const newTrack = defaultTrack(state);

      return {
        ...state,
        tracks: replaceTrack(state.tracks.concat(newTrack), action, state.tracks.length, state.layout),
        currentTrackIndex: state.tracks.length,
        cursor: defaultCursor()
      };
    }

    case DELETE_TRACK:
      if(state.tracks.length === 1) {
        return {
          ...state,
          tracks: replaceTrack([defaultTrack(state)], action, 0, state.layout),
          cursor: defaultCursor()
        };
      }
      return {
        ...state,
        tracks: state.tracks.filter((_, i) => state.currentTrackIndex !== i),
        currentTrackIndex: 0,
        cursor: defaultCursor()
      };

    case SELECT_TRACK:
      return {
        ...state,
        currentTrackIndex: action.index,
        cursor: defaultCursor()
      };

    case COPY_NOTE:
      return {
        ...state,
        clipboard: action.note
      };

    case CUT_NOTE: {
      const currentTrack = state.tracks[state.currentTrackIndex];

      return {
        ...state,
        tracks: replaceTrack(state.tracks, action, state.currentTrackIndex, state.layout),
        clipboard: action.note,
        cursor: cursor(state.cursor, currentTrack.measures, currentTrack.tuning, action)
      };
    }

    case CHANGE_LAYOUT:
      const newLayout = layout(state.layout, action);
      return {
        ...state,
        tracks: replaceTrack(state.tracks, action, state.currentTrackIndex, newLayout),
        layout: newLayout
      };

    default: {
      const currentTrack = state.tracks[state.currentTrackIndex];

      return {
        tracks: replaceTrack(state.tracks, action, state.currentTrackIndex, state.layout),
        currentTrackIndex: state.currentTrackIndex,
        clipboard: state.clipboard,
        layout: layout(state.layout, action),
        playingNote: playingNote(state.playingNote, action),
        cursor: cursor(state.cursor, currentTrack.measures, currentTrack.tuning, action)
      };
    }
  }
}
