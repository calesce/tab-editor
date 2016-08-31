import React, { PureComponent } from 'react';

import InstrumentSelect from './InstrumentSelect';
import TrackSelect from './TrackSelect';
import SidebarGroup from './SidebarGroup';
import SidebarButton from './SidebarButton';
import TimeSignature from './TimeSignatureButton';
import TempoButton from './TempoButton';
import { RepeatBegin, RepeatEnd } from './RepeatButton';
import PlayPauseButton from './PlayPauseButton';
import { MetronomeButton, CountdownButton } from './MetronomeButton';
import { InsertTrackButton, DeleteTrackButton } from './TrackButton';
import { UndoButton, RedoButton } from './UndoRedo';
import ImportButton, { ExportButton } from './ImportExportButton';
import TuningButton from './TuningButton';
import LayoutButton from './LayoutButton';

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

export default class Sidebar extends PureComponent {
  constructor() {
    super();

    this.openTempoPopover = this.openTempoPopover.bind(this);
    this.openTuningPopover = this.openTuningPopover.bind(this);
  }

  openTempoPopover() {
    this.props.togglePopover('tempo');
  }

  openTuningPopover() {
    this.props.togglePopover('tuning');
  }

  render() {
    const { popoverOpen, togglePopover, canPlay } = this.props;

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
          <TempoButton onClick={this.openTempoPopover} onClose={togglePopover} popoverOpen={popoverOpen} />
          <RepeatBegin />
          <RepeatEnd />
        </SidebarGroup>
        <SidebarGroup title='Track'>
          <TuningButton onClick={this.openTuningPopover} onClose={togglePopover} popoverOpen={popoverOpen} />
          <InstrumentSelect />
          <InsertTrackButton />
          <DeleteTrackButton />
          <TrackSelect />
        </SidebarGroup>
        <SidebarGroup title='Song'>
          <ExportButton />
          <ImportButton />
          <LayoutButton />
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
