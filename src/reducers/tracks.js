import undoable from 'redux-undo';

import { ActionTypes } from 'redux-undo';
import { REPLACE_SONG, INSERT_TRACK, DELETE_TRACK } from '../actions/tracks';
import {
  INSERT_MEASURE,
  DELETE_MEASURE,
  CHANGE_TEMPO,
  CHANGE_TIME_SIGNATURE
} from '../actions/track';
import { TOGGLE_REPEAT_BEGIN, TOGGLE_REPEAT_END } from '../actions/measure';

import trackReducer from './track';

const replaceTrack = (tracks, currentTrackIndex, action) =>
  tracks.map(
    (track, index) =>
      index === currentTrackIndex ? trackReducer(track, action) : track
  );

const undoableTracks = undoable((state, action) => {
  return action.newTracks;
});

const tracks = (tracks, action, currentTrackIndex, newTracks) => {
  switch (action.type) {
    case ActionTypes.UNDO:
    case ActionTypes.REDO: {
      if (action.type === ActionTypes.UNDO && tracks.past.length < 2) {
        return tracks;
      }
      return undoableTracks(tracks, action);
    }

    case REPLACE_SONG: {
      return undoableTracks(tracks, {
        type: 'tracks',
        newTracks: action.tracks
      });
    }

    case INSERT_TRACK:
    case DELETE_TRACK: {
      return undoableTracks(tracks, {
        type: 'tracks',
        newTracks: replaceTrack(newTracks, currentTrackIndex, action)
      });
    }

    case INSERT_MEASURE:
    case DELETE_MEASURE:
    case CHANGE_TEMPO:
    case CHANGE_TIME_SIGNATURE:
    case TOGGLE_REPEAT_BEGIN:
    case TOGGLE_REPEAT_END: {
      const newTracks = tracks.present || tracks;
      return undoableTracks(tracks, {
        type: 'tracks',
        newTracks: newTracks.map(track => trackReducer(track, action))
      });
    }

    default: {
      return undoableTracks(tracks, {
        type: 'tracks',
        newTracks: replaceTrack(
          tracks.present || tracks,
          currentTrackIndex,
          action
        )
      });
    }
  }
};

export default tracks;
