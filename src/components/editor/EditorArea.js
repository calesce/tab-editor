import React, { Component } from 'react';

export default class EditorArea extends Component {
  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '50' }}>
        BPM:
        <input onChange={this.props.bpmChanged} value={this.props.bpm} />
        <button onClick={this.props.handlePlay}>Play</button>
        <button onClick={this.props.handleStop}>Stop</button>
        <button onClick={this.props.openModal}>{this.props.timeSignature}</button>
        <button onClick={this.props.toggleLayout}>{this.props.layout}</button>
      </div>
    );
  }
}
