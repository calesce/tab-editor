import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { changeLayout, insertTrack, deleteTrack } from '../../actions/tracks';
import { setPlayingIndex, toggleMetronome } from '../../actions/playingIndex';
import { setCursor } from '../../actions/cursor';
import { addRepeatEnd } from '../../actions/measure';
import { timeSignatureSelector } from '../../util/selectors';
import InstrumentSelect from './InstrumentSelect';
import TrackSelect from './TrackSelect';

class EditorArea extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  toggleLayout = () => {
    this.props.changeLayout(this.props.layout === 'page' ? 'linear' : 'page');
  };

  handleStop = () => {
    this.props.setCursor({
      measureIndex: this.props.playingIndex.measureIndex,
      noteIndex: this.props.playingIndex.noteIndex,
      stringIndex: this.props.cursor.stringIndex
    });
    this.props.setPlayingIndex(null);
  };

  renderPlayButton = (canPlay) => {
    return canPlay ? <button onClick={this.props.handlePlay}>Play</button> : <button disabled>Play</button>;
  };

  renderPlayStop = (canPlay) => {
    return this.props.playingIndex ?
      <button onClick={this.handleStop}>Stop</button> :
      this.renderPlayButton(canPlay);
  };

  addRepeatEnd = () => {
    this.props.addRepeatEnd(this.props.cursor);
  };

  render() {
    const { openModal, timeSignature, layout, canPlay } = this.props;

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
        { this.renderPlayStop(canPlay) }
        <button onClick={openModal.bind(this, 'timeSig')}>{timeSignature}</button>
        <button onClick={this.toggleLayout}>{layout}</button>
        <button onClick={openModal.bind(this, 'tuning')}>tuning</button>
        <button onClick={openModal.bind(this, 'bpm')}>bpm</button>
        <InstrumentSelect />
        <button onClick={this.props.insertTrack}>add track</button>
        <button onClick={this.props.deleteTrack}>remove track</button>
        <TrackSelect />
        <button onClick={this.addRepeatEnd}>repeat</button>
        <button onClick={this.props.toggleMetronome}>{ this.props.metronome ? 'metronome on' : 'metronome off'}</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    layout: state.layout ? state.layout : 'page',
    playingIndex: state.playingIndex,
    cursor: state.cursor,
    timeSignature: timeSignatureSelector(state),
    metronome: state.metronome
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeLayout: bindActionCreators(changeLayout, dispatch),
    insertTrack: bindActionCreators(insertTrack, dispatch),
    deleteTrack: bindActionCreators(deleteTrack, dispatch),
    setPlayingIndex: bindActionCreators(setPlayingIndex, dispatch),
    setCursor: bindActionCreators(setCursor, dispatch),
    addRepeatEnd: bindActionCreators(addRepeatEnd, dispatch),
    toggleMetronome: bindActionCreators(toggleMetronome, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorArea);
