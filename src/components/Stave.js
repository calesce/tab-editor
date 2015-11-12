import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
var Vex = require('vexflow');
import { toneRow } from '../util';

export default class Stave extends Component {
  createRenderer = (cb) => {
    var renderer = new Vex.Flow.Renderer(findDOMNode(this.refs.stave),
        Vex.Flow.Renderer.Backends.RAPHAEL);
    var ctx = renderer.getContext();

    this.setState({
      renderer: renderer,
      ctx: ctx
    }, cb);
  }

  componentDidMount() {
    this.createRenderer(() => {
      this.drawStave(() => {
        this.drawNotes(this.props.scale);
      });
    });
  }

  componentWillReceiveProps(newProps) {
    if(!_.isEqual(newProps.scale, this.props.scale) || newProps.isPlaying) {
      this.state.ctx.clear();
      this.drawStave(() => {
        this.drawNotes(newProps.scale, newProps.currentNoteIndex - 1);
      });
    } else if(!newProps.isPlaying) {
      this.state.ctx.clear();
      this.drawStave(() => {
        this.drawNotes(newProps.scale);
      });
    }
  }

  drawStave = (cb) => {
    var stave = new Vex.Flow.Stave(0, 0, 1000);
    stave.addClef('treble').setContext(this.state.ctx).draw();
    this.setState({ stave }, cb);
  }

  drawNotes = (scale, currentNoteIndex) => {
    var { ctx, renderer, stave } = this.state;

    var notes = scale
      .map(function(note, i) {
        var staveNote = new Vex.Flow.StaveNote({ keys: [note.replace('is', '') + '/4'], duration: 'q'});
        if(note.indexOf('is') > -1) {
          staveNote.addAccidental(0, new Vex.Flow.Accidental('#'));
        } else {

          let sharpIndex = _.indexOf(scale, note + 'is');
          if(sharpIndex !== -1 && sharpIndex < i) {
            staveNote.addAccidental(0, new Vex.Flow.Accidental('n'));
          }
        }

        if(currentNoteIndex !== null && i === currentNoteIndex) {
          staveNote.setStyle({
            strokeStyle: '#f9423a',
            fillStyle: '#f9423a'
          });
        }
        return staveNote;
      });

    var voice = new Vex.Flow.Voice({
      num_beats: scale.length,
      beat_value: 4,
      resolution: Vex.Flow.RESOLUTION
    });

    voice.addTickables(notes);
    var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 1000);

    this.setState({
      notes: notes
    }, voice.draw(ctx, stave));
  }

  render() {
    return <div width='1000' ref='stave'></div>;
  }
}
