import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectTrack } from '../../actions/tracks';

export default class TrackSelect extends Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
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

function mapStateToProps(state) {
  return {
    tracks: state.tracks.present,
    currentTrackIndex: state.currentTrackIndex
  };
}

export default connect(mapStateToProps, { selectTrack })(TrackSelect);
