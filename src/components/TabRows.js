import React, { Component } from 'react';
import TabStaff from './TabStaff';

export default class TabRows extends Component {
  linearTrack = (track) => {
    return track.map((measure) => {
      return {
        ...measure,
        rowIndex: 0
      };
    });
  }

  render() {
    let track = this.props.layout === 'page' ? this.props.track : this.linearTrack(this.props.track);

    return <TabStaff {...this.props} track={track} />;
  }
}
