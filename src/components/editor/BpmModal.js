import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Modal from 'react-modal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { changeBpm } from '../../actions/measure';

const style = {
  overlay: {
    zIndex: 100
  },
  content: {
    left: '40%',
    height: '12%',
    width: '15%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10
  }
};

export default class BpmModal extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);

    this.onRequestClose = this.onRequestClose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.checkboxChanged = this.checkboxChanged.bind(this);

    this.state = {
      bpm: props.measure.bpm ? props.measure.bpm : 120,
      checked: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ bpm: nextProps.measure.bpm });
  }

  onRequestClose() {
    this.props.changeBpm(this.props.cursor, this.state.bpm, this.state.checked);
    this.props.closeModal();
  }

  onChange(e) {
    this.setState({ bpm: e.target.value });
  }

  checkboxChanged() {
    this.setState({ checked: !this.state.checked });
  }

  render() {
    return (
      <Modal style={style} isOpen={this.props.isOpen} onRequestClose={this.onRequestClose}>
        <div style={{ bottom: '5%' }}>BPM</div>
        <input onChange={this.onChange} value={this.state.bpm} />
        <span>
          <input type='checkbox' value={this.state.checked} onChange={this.checkboxChanged}/>
          <small>All Measures</small>
        </span>
        <button onClick={this.props.closeModal}>Cancel</button>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    measure: state.present.tracks[state.present.currentTrackIndex].measures[state.present.cursor.measureIndex],
    cursor: state.present.cursor
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeBpm: bindActionCreators(changeBpm, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BpmModal);
