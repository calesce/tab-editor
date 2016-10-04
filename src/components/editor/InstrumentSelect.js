import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import { setInstrument } from '../../actions/track';
import { instrumentNames } from '../../util/instrumentNames';

const toTitleSpaceCase = str => (
  str.replace(/_/g, ' ').replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
);

const selectStyle = {
  fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif', fontSize: 13, fontWeight: 600,
  width: 180
};
const wrapperStyle = { marginTop: 5, width: 180 };

const formattedInstruments = instrumentNames.map(instrument => ({
  label: toTitleSpaceCase(instrument),
  value: instrument
}));

class InstrumentSelect extends PureComponent {
  onChange = option => {
    if(option) {
      this.props.setInstrument(option.value);
    }
  }

  render() {
    return (
      <Select onChange={this.onChange} value={this.props.instrument} options={formattedInstruments}
        wrapperStyle={wrapperStyle} clearable={false} onClose={this.props.onClose}
        style={selectStyle} menuStyle={selectStyle} onOpen={this.props.onOpen}
      />
    );
  }
}

export default connect(
  state => ({ instrument: state.tracks.present[state.currentTrackIndex].instrument }),
  { setInstrument }
)(InstrumentSelect);
