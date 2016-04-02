import React, { Component } from 'react';
import Modal from 'react-modal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';

import { changeTimeSignature } from '../../actions/measure';
import { timeSignatureSelector } from '../../util/selectors';

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

export default class TimeSignatureModal extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);

    this.state = {
      checked: false
    };
  }

  onRequestClose = () => {
    let timeSignature = `${this.refs.numerator.value}/${this.refs.denominator.value}`;
    if(timeSignature !== this.props.timeSignature) {
      this.props.changeTimeSignature({ measureIndex: this.props.measureIndex }, timeSignature, this.state.checked);
    }

    this.props.closeModal();
  };

  renderNumerator = (numerator) => {
    let options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((number) => {
      return <option key={number} value={number}>{number}</option>;
    });

    return (
      <select defaultValue={parseInt(numerator)} ref='numerator' style={{ width: '90%' }}>
        {options}
      </select>
    );
  };

  renderDenominator = (denominator) => {
    let options = [1, 2, 4, 8, 16, 32].map((number) => {
      return <option key={number} value={number}>{number}</option>;
    });

    return (
      <select defaultValue={parseInt(denominator)} ref='denominator' style={{ width: '90%' }}>
        {options}
      </select>
    );
  };

  checkboxChanged = () => {
    this.setState({ checked: !this.state.checked });
  };

  render() {
    return (
      <Modal style={style} isOpen={this.props.isOpen} onRequestClose={this.onRequestClose}>
        <small style={{ bottom: '5%' }}>Time Signature:</small>
        {this.renderNumerator(this.props.timeSignature[0])}
        {this.renderDenominator(this.props.timeSignature[2])}
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
    timeSignature: timeSignatureSelector(state),
    measureIndex: state.cursor.measureIndex
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeTimeSignature: bindActionCreators(changeTimeSignature, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeSignatureModal);
