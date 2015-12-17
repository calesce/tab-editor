import React, { Component } from 'react';
import _ from 'lodash';

import TabStaff from './TabStaff';

export default class TabRows extends Component {
  convertSongIntoRows = (song) => {
    return song.reduce((rows, measure, index) => {
      let currentRow = rows[rows.length - 1];
      let currentRowWidth = currentRow.reduce((next, curr) => {
        return next + curr.width;
      }, 0);

      let returnedRows = rows;
      if(currentRowWidth + (60 * measure.notes.length) > window.innerWidth - 20) {
        if(index !== song.length - 1) {
          returnedRows.push([measure]);
        }
      } else {
        returnedRows[rows.length - 1] = currentRow.concat(measure);
      }

      return returnedRows;
    }, [[]]);
  }

  computeMeasureWidths = (song) => {
    return song.map((measure, index) => {
      let width = 60 * measure.notes.length;
      if(measure.notes.length === 0) {
        width = 40;
      }
      if(index === 0) {
        width += 15;
      }

      let prevMeasure = song[index-1];
      if(prevMeasure && prevMeasure.timeSignature === measure.timeSignature) {
        return {
          notes: measure.notes,
          width
        };
      }
      width += 20;
      if(measure.notes.length === 0) {
        width += 20;
      }

      return {
        ...measure,
        width
      };
    });
  }

  computedSong = (song) => {
    return _.compose(this.convertSongIntoRows, this.computeMeasureWidths)(song);
  }

  render() {
    return <TabStaff {...this.props} song={this.computedSong(this.props.song)} />;
  }
}
