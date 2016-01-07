import React, { Component } from 'react';
import Modal from 'react-modal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { changeBpm } from '../../actions/measure';

export default class TimeSignatureModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bpm: props.measure.bpm ? _.cloneDeep(props.measure.bpm) : 120,
      checked: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      bpm: nextProps.measure.bpm
    });
  }

  onRequestClose = () => {
    this.props.changeBpm(this.props.cursor, this.state.bpm, this.state.checked);

    this.props.closeModal();
  }

  onChange = (e) => {
    this.setState({
      bpm: e.target.value
    });
  }

  checkboxChanged = () => {
    this.setState({ checked: !this.state.checked });
  }

  render() {
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
    measure: state.tracks[state.currentTrackIndex].measures[state.cursor.measureIndex],
    cursor: state.cursor
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeBpm: bindActionCreators(changeBpm, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeSignatureModal);
