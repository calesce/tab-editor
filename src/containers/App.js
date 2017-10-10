import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from 'redux-undo';
import { StyleSheet, css } from 'aphrodite';

import * as TracksActions from '../actions/tracks';
import * as TrackActions from '../actions/track';
import * as MeasureActions from '../actions/measure';
import * as PlayingIndexActions from '../actions/playingIndex';
import * as CursorActions from '../actions/cursor';
import * as CopyPasteActions from '../actions/cutCopyPaste';

import {
  cursorAfterCutting,
  cursorAfterPasting,
  getNotesFromSelection
} from '../util/cursor';
import { updateScrollPosition } from '../util/updateScroll';
import { loadSoundfonts } from '../util/soundfonts';
import { makeMapStateToProps } from '../util/selectors';
import { makeAppSelector } from '../util/selectors/app';
import shallowEqual from '../util/shallowEqual';

import Score from '../components/Score';
import Sidebar from '../components/editor/Sidebar';
import Playback from '../components/Playback';

const Actions = Object.assign(
  TracksActions,
  TrackActions,
  MeasureActions,
  PlayingIndexActions,
  CursorActions,
  CopyPasteActions
);

const styles = StyleSheet.create({
  container: { display: 'flex' }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { openModal: null };
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyPress);
    }

    loadSoundfonts([...this.props.instruments, 'woodblock'])
      .then(buffers => this.setState({ buffers }))
      .catch(err => err);
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyPress);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { playingIndex, measures, layout, tuning, instruments } = nextProps;

    if (this.props.playingIndex && playingIndex) {
      if (
        playingIndex.noteIndex !== this.props.playingIndex.noteIndex ||
        playingIndex.measureIndex !== this.props.playingIndex.measureIndex
      ) {
        updateScrollPosition(
          playingIndex,
          measures,
          layout,
          tuning.length,
          this.scoreScrollEl
        );
      }
    } else if (!shallowEqual(this.props.instruments, instruments)) {
      this.setState({ buffers: undefined }, () => {
        loadSoundfonts(instruments)
          .then(buffers => {
            this.setState({ buffers });
          })
          .catch(err => err);
      });
    }
  }

  handleStop() {
    this.props.actions.setCursor({
      measureIndex: this.props.playingIndex.measureIndex,
      noteIndex: this.props.playingIndex.noteIndex,
      stringIndex: this.props.cursor.stringIndex
    });
    this.props.actions.setPlayingIndex(null);
  }

  handlePlay() {
    if (!this.props.playingIndex && this.state.buffers) {
      if (
        !(this.props.metronome || this.props.countdown) ||
        this.state.buffers.woodblock
      ) {
        this.props.actions.setPlayingIndex(this.props.cursor);
      }
    }
  }

  navigateCursor(event) {
    event.preventDefault();
    if (event.keyCode === 39) {
      // right arrow
      const { measures } = this.props;
      const { measureIndex, noteIndex } = this.props.cursor;
      if (
        measureIndex === measures.length - 1 &&
        (noteIndex === measures[measureIndex].notes.length - 1 ||
          measures[measureIndex].notes.length === 0)
      ) {
        this.props.actions.insertMeasure();
      }
      this.props.actions.moveCursorRight();
    } else if (event.keyCode === 37) {
      // left arrow
      this.props.actions.moveCursorLeft();
    } else if (event.keyCode === 38) {
      // up arrow
      this.props.actions.moveCursorUp();
    } else if (event.keyCode === 40) {
      // down arrow
      this.props.actions.moveCursorDown();
    }
  }

  deleteNote() {
    const { measureIndex } = this.props.cursor;
    const notes = this.props.measures[measureIndex].notes;

    if (notes.length > 0) {
      this.props.actions.deleteNote(this.props.cursor);
    } else if (notes.length === 0) {
      this.props.actions.deleteMeasure(measureIndex);
    }
  }

  pasteNote(event) {
    const { cursor, clipboard, actions, measures } = this.props;

    if (!clipboard) {
      return;
    }
    event.preventDefault();

    actions.pasteNote(cursor, clipboard);
    actions.setCursor(cursorAfterPasting(measures, clipboard, cursor));
  }

  cutNote() {
    const { selectRange, cursor, actions, measures } = this.props;

    if (selectRange) {
      const newCursor = cursorAfterCutting(measures, selectRange, cursor);
      actions.setCursor(newCursor);
      actions.setSelectRange(undefined);
      actions.cutNote(
        newCursor,
        getNotesFromSelection(measures, cursor, selectRange),
        selectRange
      );
    } else {
      const newCursor = {
        ...cursor,
        noteIndex: cursor.noteIndex === 0 ? 0 : cursor.noteIndex - 1
      };
      actions.setCursor(newCursor);
      actions.cutNote(
        cursor,
        getNotesFromSelection(measures, cursor, selectRange),
        selectRange
      );
    }
  }

  selectAllNotes() {
    const selection = this.props.measures.map(_ => 'all');
    this.props.actions.setSelectRange(selection);
  }

  handleKeyPress = event => {
    if (
      this.state.popover ||
      (this.props.playingIndex && event.keyCode !== 32)
    ) {
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.keyCode === 67) {
      // cmd/ctrl+c
      event.preventDefault();
      return this.props.actions.copyNote(
        getNotesFromSelection(
          this.props.measures,
          this.props.cursor,
          this.props.selectRange
        )
      );
    }
    if ((event.metaKey || event.ctrlKey) && event.keyCode === 86) {
      // cmd/ctrl+v
      return this.pasteNote(event);
    }
    if ((event.metaKey || event.ctrlKey) && event.keyCode === 88) {
      // cmd/ctrl+x
      event.preventDefault();
      return this.cutNote();
    }
    if ((event.metaKey || event.ctrlKey) && event.keyCode === 65) {
      // cmd/ctrl+a
      event.preventDefault();
      return this.selectAllNotes();
    }

    if (event.keyCode <= 57 && event.keyCode >= 48 && !event.metaKey) {
      return this.props.actions.changeNote(
        this.props.cursor,
        event.keyCode - 48
      );
    } else if (event.keyCode === 82 && !event.metaKey && !event.ctrlKey) {
      this.props.actions.makeNoteRest(this.props.cursor);
    } else if (event.keyCode === 8) {
      // delete
      event.preventDefault();
      this.deleteNote();
    } else if (event.keyCode === 73 && !event.metaKey) {
      // i
      return this.props.actions.insertNote(this.props.cursor);
    } else if (event.keyCode === 32) {
      // spacebar
      event.preventDefault();
      return this.props.playingIndex ? this.handleStop() : this.handlePlay();
    } else if (event.keyCode === 190) {
      // period
      this.props.actions.toggleNoteDotted(this.props.cursor);
    } else if (event.shiftKey && event.keyCode === 187) {
      // plus
      return this.props.actions.increaseNoteLength(this.props.cursor);
    } else if (event.keyCode === 189) {
      // minus
      return this.props.actions.decreaseNoteLength(this.props.cursor);
    } else if (event.shiftKey && event.keyCode === 222) {
      // "
      this.props.actions.toggleNoteTremolo(this.props.cursor);
    } else if (event.keyCode === 86) {
      // v
      this.props.actions.toggleNoteVibrato(this.props.cursor);
    } else if (event.shiftKey && event.keyCode === 78) {
      // N
      this.props.actions.toggleNoteTrill(this.props.cursor);
    } else if (event.keyCode === 220) {
      // \
      const { measureIndex, noteIndex } = this.props.cursor;
      const note = this.props.measures[measureIndex].notes[noteIndex];
      if (note.tuplet) {
        this.props.actions.setNoteTuplet(this.props.cursor, undefined);
      } else {
        this.props.actions.setNoteTuplet(this.props.cursor, '2/3'); // store string representation of multiplier for now
      }
    } else if (event.keyCode >= 37 && event.keyCode <= 40) {
      return this.navigateCursor(event);
    } else if ((event.metaKey || event.ctrlKey) && event.keyCode === 90) {
      // Z
      event.preventDefault();
      return event.shiftKey ? this.props.redo() : this.props.undo();
    }
  };

  togglePopover = popover => {
    this.setState({ popover: this.state.popover ? null : popover });
  };

  render() {
    const { playingIndex, metronome, countdown } = this.props;
    const { popover, buffers } = this.state;
    const canPlay = buffers && (!(metronome || countdown) || buffers.woodblock);

    return (
      <div className={css(styles.container)}>
        {playingIndex && (
          <Playback
            buffers={buffers}
            metronome={metronome}
            countdown={countdown}
          />
        )}
        <Sidebar
          canPlay={canPlay}
          popoverOpen={popover}
          togglePopover={this.togglePopover}
        />
        <Score
          scrollRef={el => {
            this.scoreScrollEl = el;
          }}
        />
      </div>
    );
  }
}

export default connect(makeMapStateToProps(makeAppSelector), dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  undo: bindActionCreators(ActionCreators.undo, dispatch),
  redo: bindActionCreators(ActionCreators.redo, dispatch)
}))(App);
