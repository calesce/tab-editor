import React, { Component } from 'react';
import _ from 'lodash';

import TabStaff from './TabStaff';

export default class TabRows extends Component {
  convertTrackIntoRows = (track) => {
    return track.reduce((rows, measure, index) => {
      let currentRow = rows[rows.length - 1];
      let currentRowWidth = currentRow.reduce((next, curr) => {
        return next + curr.width;
      }, 0);

      let returnedRows = rows;
      if(currentRowWidth + (60 * measure.notes.length) > window.innerWidth - 20) {
        if(index !== track.length - 1) {
          returnedRows.push([measure]);
        }
      } else {
        returnedRows[rows.length - 1] = currentRow.concat(measure);
      }

      return returnedRows;
    }, [[]]);
  }

  singleRowTrack = (track) => {
    return [track];
  }

  computeMeasureWidths = (track) => {
    return track.map((measure, index) => {
      let width = 60 * measure.notes.length;
      if(measure.notes.length === 0) {
        width = 40;
      }
      if(index === 0) {
        width += 15;
      }

      let prevMeasure = track[index-1];
      if(prevMeasure && prevMeasure.timeSignature === measure.timeSignature) {
        return {
          ...measure,
          width
        };
      }
      width += 20;
      if(measure.notes.length === 0) {
        width += 20;
      }

      return {
        ...measure,
        width,
        renderTimeSignature: true
      };
    });
  }

  pageTrack = (track) => {
    return _.compose(this.convertTrackIntoRows, this.computeMeasureWidths)(track);
  }

  linearTrack = (track) => {
    return _.compose(this.singleRowTrack, this.computeMeasureWidths)(track);
  }

  render() {
    let track = this.props.layout === 'page' ? this.pageTrack(this.props.song) : this.linearTrack(this.props.song);

    return <TabStaff {...this.props} song={track} />;
  }
}
