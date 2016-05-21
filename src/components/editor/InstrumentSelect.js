import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';

import { setInstrument } from '../../actions/track';

import instruments from 'soundfont-player/instruments.json';

export default class InstrumentSelect extends Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  onChange(e) {
    const instrument = e.target.value;
    this.props.setInstrument(instrument);
  }

  render() {
    return (
      <select onChange={this.onChange} value={this.props.instrument}>
        { instruments.map((instrument) => {
          return <option key={instrument} value={instrument}>{instrument}</option>;
        })}
      </select>
    );
  }
}

function mapStateToProps(state) {
  return {
    instrument: state.present.tracks[state.present.currentTrackIndex].instrument
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setInstrument: bindActionCreators(setInstrument, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InstrumentSelect);
