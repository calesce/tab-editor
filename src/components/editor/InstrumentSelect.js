import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { StyleSheet, css } from 'aphrodite';

import { setInstrument } from '../../actions/track';
import { instrumentNames } from '../../util/instrumentNames';

const toTitleSpaceCase = str =>
  str
    .replace(/_/g, ' ')
    .replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

const styles = StyleSheet.create({
  wrapper: { marginTop: 5, width: 180, height: 36 }
});

const selectStyle = {
  fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif',
  fontSize: 13,
  fontWeight: 600,
  width: 180
};
const menuStyle = { ...selectStyle, width: 170 };

const formattedInstruments = instrumentNames.map(instrument => ({
  label: toTitleSpaceCase(instrument),
  value: instrument
}));

class InstrumentSelect extends PureComponent {
  onChange = option => {
    if (option) {
      this.props.setInstrument(option.value);
    }
  };

  render() {
    return (
      <Select
        onChange={this.onChange}
        value={this.props.instrument}
        options={formattedInstruments}
        className={css(styles.wrapper)}
        clearable={false}
        onClose={this.props.onClose}
        style={selectStyle}
        menuStyle={menuStyle}
        onOpen={this.props.onOpen}
      />
    );
  }
}

export default connect(
  state => ({
    instrument: state.tracks.present[state.currentTrackIndex].instrument
  }),
  { setInstrument }
)(InstrumentSelect);
