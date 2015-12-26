import React, { Component } from 'react';
import TabStaff from './TabStaff';

export default class TabRows extends Component {
  convertTrackIntoRows = (track) => {
    return track.reduce((rows, measure, index) => {
      let currentRow = rows[rows.length - 1];
      let currentRowWidth = currentRow.reduce((next, curr) => {
        return next + curr.width;
      }, 0);

      let returnedRows = rows;
      if(currentRowWidth + (55 * measure.notes.length) > window.innerWidth - 20) {
        if(index !== track.length - 1) {
          returnedRows.push([measure]);
        }
      } else {
        returnedRows[rows.length - 1] = currentRow.concat(measure);
      }

      return returnedRows;
    }, [[]]);
  }

  pageTrack = (track) => {
    return this.convertTrackIntoRows(track);
  }

  linearTrack = (track) => {
    return [track];
  }

  render() {
    let track = this.props.layout === 'page' ? this.pageTrack(this.props.track) : this.linearTrack(this.props.track);

    return <TabStaff {...this.props} track={track} />;
  }
}
