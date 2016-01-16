import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { changeLayout, insertTrack, deleteTrack } from '../../actions/tracks';
import { setPlayingNote } from '../../actions/playingNote';
import { setCursor } from '../../actions/cursor';
import { timeSignatureSelector } from '../../util/selectors';
import InstrumentSelect from './InstrumentSelect';
import TrackSelect from './TrackSelect';

class EditorArea extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  toggleLayout = () => {
    this.props.changeLayout(this.props.layout === 'page' ? 'linear' : 'page');
  };

  hanleStop = () => {
    this.props.actions.setCursor({
      measureIndex: this.props.playingNote.measure,
      noteIndex: this.props.playingNote.noteIndex,
      stringIndex: this.props.cursor.stringIndex
    });
    this.props.actions.setPlayingNote(null);
  };

  renderPlayStop() {
    return this.props.playingNote ?
      <button onClick={this.handleStop}>Stop</button> :
      <button onClick={this.props.handlePlay}>Play</button>;
  };

  render() {
    const { openModal, timeSignature, layout } = this.props;

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
        <button onClick={openModal.bind(this, 'timeSig')}>{timeSignature}</button>
        <button onClick={this.toggleLayout}>{layout}</button>
        <button onClick={openModal.bind(this, 'tuning')}>tuning</button>
        <button onClick={openModal.bind(this, 'bpm')}>bpm</button>
        <InstrumentSelect />
        <button onClick={this.props.insertTrack}>add track</button>
        <button onClick={this.props.deleteTrack}>remove track</button>
        <TrackSelect />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    layout: state.layout,
    playingNote: state.playingNote,
    cursor: state.cursor,
    timeSignature: timeSignatureSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeLayout: bindActionCreators(changeLayout, dispatch),
    insertTrack: bindActionCreators(insertTrack, dispatch),
    deleteTrack: bindActionCreators(deleteTrack, dispatch),
    setPlayingNote: bindActionCreators(setPlayingNote, dispatch),
    setCursor: bindActionCreators(setCursor, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorArea);
