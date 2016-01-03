import React, { Component } from 'react';
import { connect } from 'react-redux';
import Measure from './measure/Measure';

const style = {
  padding: 5,
  display: 'flex',
  flexWrap: 'wrap',
  flex: 1
};

class TabStaff extends Component {
  getIndexOfRow = (rowIndex, totalMeasureIndex) => {
    return this.props.track.reduce((accum, measure, i) => {
      if(measure.rowIndex === rowIndex && i < totalMeasureIndex) {
        return accum + 1;
      }
      return accum;
    }, 0);
  }

  renderMeasureForRow = (measure, totalMeasureIndex) => {
    const indexOfRow = this.getIndexOfRow(measure.rowIndex, totalMeasureIndex);

    return (
      <Measure key={totalMeasureIndex} measure={measure}
        currentPlayingNote={this.props.currentPlayingNote}
        totalMeasureIndex={totalMeasureIndex}
        currentEditingIndex={this.props.currentEditingIndex}
        onClick={this.props.onClick}
        indexOfRow={indexOfRow}
      />
    );
  }

  calcWidth = (track) => {
    return track.reduce((width, measure) => {
      return measure.width + width;
    }, 20);
  }

  calcHeight = () => {
    return (this.props.track[this.props.track.length - 1].rowIndex + 1) * 130 + 50;
  }

  render() {
    let height = this.props.layout === 'linear' ? '100% - 10' : this.calcHeight();
    let width = this.props.layout === 'linear' ? this.calcWidth(this.props.track) : window.innerWidth - 10;
    return (
      <div style={{ ...style, width, height, paddingTop: '60' }}>
        { this.props.track.map(this.renderMeasureForRow) }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    track: state.tracks[state.currentTrackIndex].measures,
    layout: state.layout
  };
}

export default connect(mapStateToProps, null)(TabStaff);
