import React, { PureComponent } from 'react';
import { StyleSheet, css } from 'aphrodite';

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

const styles = StyleSheet.create({
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100vh',
    width: 255,
    'flex-shrink': '0',
    overflow: 'hidden',
    background: 'wheat',
    // try sandybrown, peachpuff, moccasin, navajowhite, linen, cornsilk, wheat
    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
  }
});

export default class Sidebar extends PureComponent {
  openTempoPopover = () => {
    this.props.togglePopover('tempo');
  };

  openTuningPopover = () => {
    this.props.togglePopover('tuning');
  };

  openInstrumentSelect = () => {
    this.props.togglePopover('instrumentSelect');
  };

  openTrackSelect = () => {
    this.props.togglePopover('trackSelect');
  };

  render() {
    const { popoverOpen, togglePopover, canPlay } = this.props;

    return (
      <div className={css(styles.sidebar)}>
        <SidebarGroup title="Notes">
          <SidebarButton duration="w" />
          <SidebarButton duration="h" />
          <SidebarButton duration="q" />
          <SidebarButton duration="e" />
          <SidebarButton duration="s" />
          <SidebarButton duration="t" />
          <SidebarButton rest />
          <SidebarButton dot />
          <SidebarButton tuplet />
          <SidebarButton tremolo />
          <SidebarButton trill />
          <SidebarButton vibrato />
        </SidebarGroup>
        <SidebarGroup title="Measure">
          <TimeSignature />
          <TempoButton
            onClick={this.openTempoPopover}
            onClose={togglePopover}
            popoverOpen={popoverOpen}
          />
          <RepeatBegin />
          <RepeatEnd />
        </SidebarGroup>
        <SidebarGroup title="Track">
          <TuningButton
            onClick={this.openTuningPopover}
            onClose={togglePopover}
            popoverOpen={popoverOpen}
          />
          <InstrumentSelect
            onOpen={this.openInstrumentSelect}
            onClose={togglePopover}
            popoverOpen={popoverOpen}
          />
          <InsertTrackButton />
          <DeleteTrackButton />
          <TrackSelect
            onOpen={this.openTrackSelect}
            onClose={togglePopover}
            popoverOpen={popoverOpen}
          />
        </SidebarGroup>
        <SidebarGroup title="Song">
          <ExportButton />
          <ImportButton />
          <LayoutButton />
        </SidebarGroup>
        <SidebarGroup title="Play">
          <PlayPauseButton canPlay={canPlay} />
          <MetronomeButton />
          <CountdownButton />
        </SidebarGroup>
        <SidebarGroup title="Oops">
          <UndoButton />
          <RedoButton />
        </SidebarGroup>
      </div>
    );
  }
}
