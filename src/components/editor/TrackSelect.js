import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectTrack } from '../../actions/tracks';

import type { State, Track } from '../../util/stateTypes';

class TrackSelect extends Component {
  props: {
    currentTrackIndex: number,
    tracks: Array<Track>,
    selectTrack: Function
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e: Event) {
    const track = e.target.value;
    this.props.selectTrack(parseInt(track));
  }

  render() {
    return (
      <select onChange={this.onChange} value={this.props.currentTrackIndex}>
        { this.props.tracks.map((_, track) => {
          return <option key={track} value={track}>{`track ${track + 1}`}</option>;
        })}
      </select>
    );
  }
}

export default connect(
  (state: State) => ({
    tracks: state.tracks.present,
    currentTrackIndex: state.currentTrackIndex
  }),
  { selectTrack }
)(TrackSelect);
