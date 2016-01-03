import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { changeLayout } from '../../actions/track';

class EditorArea extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  renderPlayStop() {
    return this.props.currentPlayingNote ?
      <button onClick={this.props.handleStop}>Stop</button> :
      <button onClick={this.props.handlePlay}>Play</button>;
  }

  toggleLayout = () => {
    this.props.changeLayout(this.props.layout === 'page' ? 'linear' : 'page');
  }

  render() {
    const style = {
      position: 'fixed',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      top: 0,
      left: 0,
      height: 50,
      zIndex: 99,
      width: '100%',
      background: 'tomato'
    };

    return (
      <div style={style}>
        { this.renderPlayStop() }
        <button onClick={this.props.openModal}>{this.props.timeSignature}</button>
        <button onClick={this.toggleLayout}>{this.props.layout}</button>
        <button onClick={this.props.openTuning}>tuning</button>
        <button onClick={this.props.openBpm}>bpm</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    layout: state.layout
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeLayout: bindActionCreators(changeLayout, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorArea);
