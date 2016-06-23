import trackReducer from './track';
import { prepareTrack } from '../util';
import { REPLACE_SONG } from '../actions/tracks';
import { INSERT_MEASURE, DELETE_MEASURE, CHANGE_BPM, CHANGE_TIME_SIGNATURE } from '../actions/track';

const replaceTrack = (tracks, currentTrackIndex, layout = 'page', scoreBox, action) => {
  return tracks.map((t, index) => {
    if(index === currentTrackIndex) {
      const newTrack = trackReducer(t, action);
      return prepareTrack(newTrack, layout, scoreBox);
    }
    return t;
  });
};

const applyActionToEachTrack = (tracks, currentTrackIndex, layout, scoreBox, action) => {
  return tracks.map(t => prepareTrack(trackReducer(t, action), layout, scoreBox));
};

export default function tracks(tracks, currentTrackIndex, layout, scoreBox, action) {
  switch(action.type) {
    case REPLACE_SONG: {
      return action.tracks.map(track => prepareTrack(track, layout, scoreBox));
    }

    case INSERT_MEASURE:
    case DELETE_MEASURE:
    case CHANGE_BPM:
    case CHANGE_TIME_SIGNATURE: {
      return applyActionToEachTrack(tracks, currentTrackIndex, layout, scoreBox, action);
    }

    default: {
      return replaceTrack(tracks, currentTrackIndex, layout, scoreBox, action);
    }
  }
}
