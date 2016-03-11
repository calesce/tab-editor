import React, { Component } from 'react';
import { connect } from 'react-redux';
import Measure from './measure/Measure';

const style = {
  padding: 5,
  paddingTop: 60,
  display: 'flex',
  flexWrap: 'wrap',
  flex: 1
};

class TabStaff extends Component {
  calcWidth = (measures) => {
    return measures.reduce((width, measure) => {
      return measure.width + width;
    }, 20);
  };

  calcHeight = (measures, tuning) => {
    return 1.7 * (measures[measures.length - 1].rowIndex + 1) * (27 * tuning.length) + 40;
  };

  renderMeasureForRow = (_, measureIndex) => {
    return <Measure key={measureIndex} measureIndex={measureIndex} />;
  };

  render() {
    const { layout, tuning, measures } = this.props;

    let height = layout === 'linear' ? '100% - 10' : this.calcHeight(measures, tuning);
    let width = layout === 'linear' ? this.calcWidth(measures) : window.innerWidth - 10;
    return (
      <div style={{ ...style, width, height }}>
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
