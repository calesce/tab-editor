import React, { Component } from 'react';

export default class EditorArea extends Component {
  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '50' }}>
        <button onClick={this.props.handlePlay}>Play</button>
        <button onClick={this.props.handleStop}>Stop</button>
        <button onClick={this.props.openModal}>{this.props.timeSignature}</button>
        <button onClick={this.props.toggleLayout}>{this.props.layout}</button>
        <button onClick={this.props.openTuning}>tuning</button>
      </div>
    );
  }
}
