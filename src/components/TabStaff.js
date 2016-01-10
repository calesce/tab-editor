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
  getIndexOfRow = (measures, rowIndex, measureIndex) => {
    return measures.reduce((accum, measure, i) => {
      if(measure.rowIndex === rowIndex && i < measureIndex) {
        return accum + 1;
      }
      return accum;
    }, 0);
  };

  calcWidth = (measures) => {
    return measures.reduce((width, measure) => {
      return measure.width + width;
    }, 20);
  };

  calcHeight = (measures, tuning) => {
    return (measures[measures.length - 1].rowIndex + 1) * (27 * tuning.length) + 50;
  };

  renderMeasureForRow = (measure, measureIndex) => {
    const indexOfRow = this.getIndexOfRow(this.props.measures, measure.rowIndex, measureIndex);

    return (
      <Measure key={measureIndex} measureIndex={measureIndex} indexOfRow={indexOfRow} />
    );
  };

  render() {
    const { layout, tuning, measures } = this.props;

    let height = layout === 'linear' ? '100% - 10' : this.calcHeight(measures, tuning);
    let width = layout === 'linear' ? this.calcWidth(measures) : window.innerWidth - 10;
    return (
      <div style={{ ...style, width, height, paddingTop: '60' }}>
        { this.props.measures.map(this.renderMeasureForRow) }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const track = state.tracks[state.currentTrackIndex];

  return {
    measures: track.measures,
    tuning: track.tuning,
    layout: state.layout
  };
}

export default connect(mapStateToProps)(TabStaff);
