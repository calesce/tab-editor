import undoable from 'redux-undo';

import { ActionTypes } from 'redux-undo';
import { REPLACE_SONG, INSERT_TRACK, DELETE_TRACK } from '../actions/tracks';
import { INSERT_MEASURE, DELETE_MEASURE, CHANGE_BPM, CHANGE_TIME_SIGNATURE } from '../actions/track';

import trackReducer from './track';
import { prepareTrack } from '../util';

const replaceTrack = (tracks, currentTrackIndex, layout, scoreBox, action) => {
  return tracks.map((track, index) => {
    if(index === currentTrackIndex) {
      return prepareTrack(trackReducer(track, action), layout, scoreBox);
    }
    return track;
  });
};

const applyActionToEachTrack = (tracks, layout, scoreBox, action) => (
  tracks.map(track => prepareTrack(trackReducer(track, action), layout, scoreBox))
);

const undoableTracks = undoable((state, action) => {
  return action.newTracks;
});

const tracks = (tracks, action, currentTrackIndex, layout, scoreBox, newTracks) => {
  switch(action.type) {
    case ActionTypes.UNDO:
    case ActionTypes.REDO: {
      if(action.type === ActionTypes.UNDO && tracks.past.length < 2) {
        return tracks;
      }
      return undoableTracks(tracks, action);
    }

    case REPLACE_SONG: {
      return undoableTracks(tracks, {
        type: 'tracks',
        newTracks: action.tracks.map(track => prepareTrack(track, layout, scoreBox))
      });
    }

    case INSERT_TRACK:
    case DELETE_TRACK: {
      return undoableTracks(tracks, {
        type: 'tracks',
        newTracks: replaceTrack(newTracks, currentTrackIndex, layout, scoreBox, action)
      });
    }

    case INSERT_MEASURE:
    case DELETE_MEASURE:
    case CHANGE_BPM:
    case CHANGE_TIME_SIGNATURE: {
      return undoableTracks(tracks, {
          type: 'tracks',
          newTracks: applyActionToEachTrack(tracks.present, layout, scoreBox, action)
      });
    }

    default: {
      return undoableTracks(tracks, {
        type: 'tracks',
        newTracks: replaceTrack(tracks.present || tracks, currentTrackIndex, layout, scoreBox, action)
      });
    }
  }
};


export default tracks;
