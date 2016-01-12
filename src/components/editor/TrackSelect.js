import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { selectTrack } from '../../actions/tracks';

export default class TrackSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      track: props.currentTrackIndex
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      track: nextProps.currentTrackIndex
    });
  }

  onChange = (e) => {
    this.setState({
      track: e.target.value
    }, () => {
      this.props.selectTrack(parseInt(e.target.value));
    });
  };

  render() {
    return (
      <select onChange={this.onChange} value={this.state.track}>
        { this.props.tracks.map((_, track) => {
          return <option key={track} value={track}>{`track ${track + 1}`}</option>;
        })}
      </select>
    );
  }
}

function mapStateToProps(state) {
  return {
    tracks: state.tracks,
    currentTrackIndex: state.currentTrackIndex
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectTrack: bindActionCreators(selectTrack, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackSelect);
