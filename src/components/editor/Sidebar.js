import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { connect } from 'react-redux';

import { changeLayout } from '../../actions/tracks';

import InstrumentSelect from './InstrumentSelect';
import TrackSelect from './TrackSelect';
import SidebarGroup from './SidebarGroup';
import SidebarButton from './SidebarButton';
import TimeSignature from './TimeSignatureButton';
import BpmButton from './BpmButton';
import { RepeatStart, RepeatEnd } from './RepeatButton';
import PlayPauseButton from './PlayPauseButton';
import { MetronomeButton, CountdownButton } from './MetronomeButton';
import { InsertTrackButton, DeleteTrackButton } from './TrackButton';
import { UndoButton, RedoButton } from './UndoRedo';
import ImportButton, { ExportButton } from './ImportExportButton';
import TuningButton from './TuningButton';

const style = {
  position: 'fixed',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  top: 0,
  left: 0,
  height: '100%',
  zIndex: 3,
  width: 255,
  overflow: 'hidden',
  background: 'wheat', // try sandybrown, peachpuff, moccasin, navajowhite, linen, cornsilk, wheat
  boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
};

class Sidebar extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor() {
    super();

    this.toggleLayout = this.toggleLayout.bind(this);
    this.openBpm = this.openBpm.bind(this);
    this.openTuning = this.openTuning.bind(this);
  }

  toggleLayout() {
    this.props.changeLayout(this.props.layout === 'page' ? 'linear' : 'page');
  }

  openBpm() {
    this.props.togglePopover('bpm');
  }

  openTuning() {
    this.props.togglePopover('tuning');
  }

  render() {
    const { popoverOpen, togglePopover, layout, canPlay } = this.props;

    return (
      <div style={style}>
        <SidebarGroup title='Notes'>
          <SidebarButton duration='w'/>
          <SidebarButton duration='h'/>
          <SidebarButton duration='q'/>
          <SidebarButton duration='e'/>
          <SidebarButton duration='s'/>
          <SidebarButton duration='t'/>
          <SidebarButton rest />
          <SidebarButton dot />
          <SidebarButton tuplet />
          <SidebarButton tremolo />
          <SidebarButton trill />
          <SidebarButton vibrato />
        </SidebarGroup>
        <SidebarGroup title='Measure'>
          <TimeSignature />
          <BpmButton onClick={this.openBpm} onClose={togglePopover} popoverOpen={popoverOpen === 'bpm'} />
          <RepeatStart />
          <RepeatEnd />
        </SidebarGroup>
        <SidebarGroup title='Track'>
          <InsertTrackButton />
          <DeleteTrackButton />
          <TuningButton onClick={this.openTuning} onClose={togglePopover} popoverOpen={popoverOpen === 'tuning'} />
          <InstrumentSelect />
          <TrackSelect />
        </SidebarGroup>
        <SidebarGroup title='Song'>
          <ExportButton />
          <ImportButton />
          <button onClick={this.toggleLayout}>{layout}</button>
        </SidebarGroup>
        <SidebarGroup title='Play'>
          <PlayPauseButton canPlay={canPlay} />
          <MetronomeButton />
          <CountdownButton />
        </SidebarGroup>
        <SidebarGroup title='Oops'>
          <UndoButton />
          <RedoButton />
        </SidebarGroup>
      </div>
    );
  }
}

export default connect(state => ({ layout: state.layout }), { changeLayout })(Sidebar);
