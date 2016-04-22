import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Modal from 'react-modal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import { changeTuning } from '../../actions/track';
import { nextNote, previousNote } from '../../util/midiNotes';

const style = {
  overlay: {
    zIndex: 100
  },
  content: {
    left: '40%',
    height: '50%',
    width: '15%',
    display: 'flex',
    flexDirection: 'column',
    padding: 10
  }
};

class TuningButton extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.index);
  }

  render() {
    return <button onClick={this.onClick}>{this.props.label}</button>;
  }
}

class TuningModal extends Component {
  constructor(props) {
    super(props);

    this.onRequestClose = this.onRequestClose.bind(this);
    this.incrementAllStrings = this.incrementAllStrings.bind(this);
    this.decrementAllStrings = this.decrementAllStrings.bind(this);
    this.incrementString = this.incrementString.bind(this);
    this.decrementString = this.decrementString.bind(this);
    this.renderTuningEditor = this.renderTuningEditor.bind(this);

    this.state = {
      tuning: cloneDeep(this.props.tuning)
    };
  }

  onRequestClose() {
    this.props.changeTuning(this.state.tuning);
    this.props.closeModal();
  }

  incrementAllStrings() {
    this.setState({
      tuning: this.state.tuning.map(nextNote)
    });
  }

  decrementAllStrings() {
    this.setState({
      tuning: this.state.tuning.map(previousNote)
    });
  }

  incrementString(index) {
    this.setState({
      tuning: this.state.tuning.map((string, i) => i === index ? nextNote(string) : string)
    });
  }

  decrementString(index) {
    this.setState({
      tuning: this.state.tuning.map((string, i) => i === index ? previousNote(string) : string)
    });
  }

  renderTuningEditor() {
    return (
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-around' }}>
        {this.state.tuning.map((string, i) => {
          return (
            <div key={i}>
              {string}
              <TuningButton onClick={this.incrementString} index={i} label='^' />
              <TuningButton onClick={this.decrementString} index={i} label='v' />
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <Modal style={style} isOpen={this.props.isOpen} onRequestClose={this.onRequestClose}>
        <div>
          <small style={{ bottom: '5%' }}>Tuning:</small>
          <button onClick={this.incrementAllStrings} >^</button>
          <button onClick={this.decrementAllStrings} >v</button>
        </div>
        { this.renderTuningEditor() }
        <button onClick={this.props.closeModal}>Cancel</button>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    tuning: state.tracks[state.currentTrackIndex].tuning
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeTuning: bindActionCreators(changeTuning, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TuningModal);
