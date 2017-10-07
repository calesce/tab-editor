import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import { selectTrack } from '../../actions/tracks';
import type { State, Track } from '../../util/stateTypes';

const selectStyle = {
  fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif',
  fontSize: 13,
  fontWeight: 600,
  width: 140
};
const menuStyle = {
  fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif',
  fontSize: 13,
  fontWeight: 600,
  width: 135
};
const wrapperStyle = { marginTop: 5, width: 140, height: 33 };

class TrackSelect extends Component {
  props: {
    currentTrackIndex: number,
    tracks: Array<Track>,
    selectTrack: Function,
    onOpen: Function,
    onClose: Function
  };

  onChange = option => {
    const track = option.value;
    this.props.selectTrack(parseInt(track));
  };

  render() {
    const options = this.props.tracks.map((_, track) => ({
      value: track,
      label: `Track ${track + 1}`
    }));
    return (
      <Select
        onChange={this.onChange}
        value={this.props.currentTrackIndex}
        clearable={false}
        searchable={false}
        disabled={this.props.tracks.length === 1}
        options={options}
        wrapperStyle={wrapperStyle}
        style={selectStyle}
        menuStyle={menuStyle}
        onOpen={this.props.onOpen}
        onClose={this.props.onClose}
      />
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
