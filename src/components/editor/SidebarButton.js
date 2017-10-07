import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';

import {
  changeNoteLength,
  makeNoteRest,
  toggleNoteDotted,
  setNoteTuplet,
  toggleNoteTremolo,
  toggleNoteTrill,
  toggleNoteVibrato
} from '../../actions/measure';

const styles = StyleSheet.create({
  button: {
    ':hover': {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'pointer',
      fill: '#b3caf5',
      stroke: '#b3caf5'
    },
    color: 'black',
    fill: 'black',
    stroke: 'black',
    fontSize: 36,
    fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif',
    fontWeight: 800
  },
  selected: { fill: '#b3caf5', stroke: '#b3caf5' },
  trill: {
    fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif',
    fontSize: 12,
    fontWeight: 500
  },
  tuplet: {
    fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif',
    fontSize: 13,
    fontWeight: 500,
    fontStyle: 'italic'
  }
});

const WholeNote = () => {
  return (
    <g transform="scale(0.8), translate(15, 8)">
      <path
        strokeOpacity="0.2"
        stroke="grey"
        d="M12.768 35.447c-3.296-.174-5.872-3.1-6.906-6.127-.626-1.776-.282-4.44 1.804-4.94 3.023-.513 5.53 2.055 6.937 4.513 1.002 1.822 1.555 4.692-.322 6.137-.445.3-.984.42-1.512.417zm5.252-10.374c-3.714-2.256-8.406-2.432-12.473-1.17C2.97 24.804.024 26.72 0 29.84c-.002 3.055 2.842 4.96 5.358 5.87 3.983 1.302 8.58 1.187 12.298-.89 2.106-1.12 3.972-3.44 3.34-6.01-.35-1.653-1.615-2.89-2.976-3.737z"
      />
    </g>
  );
};

const HalfNote = () => {
  return (
    <g transform="scale(0.8), translate(15, 10)">
      <path
        strokeWidth={0}
        d="M12.22 34.28c3.668-1.964 5.622-5.522 4.42-8.198-1.282-2.856-5.69-3.66-9.835-1.8-4.147 1.863-6.47 5.692-5.188 8.547 1.282 2.855 5.688 3.66 9.834 1.8.26-.118.527-.217.77-.347zm-1.2-2.42c-.258.135-.522.235-.798.36-3.536 1.587-6.95 1.663-7.62.166-.673-1.494 1.65-3.996 5.186-5.584 3.536-1.587 6.95-1.663 7.62-.166.62 1.378-1.31 3.64-4.386 5.225z"
      />
      <path strokeWidth="1.2" d="M16.110564 29.86774v-44.670396" />
    </g>
  );
};

const QuarterNote = () => {
  return (
    <g transform="scale(0.8), translate(15, 10)">
      <path
        strokeWidth={0}
        d="M11.980408 34.601027c3.667507-1.965567 5.621702-5.523714 4.419597-8.200397-1.28224-2.85513-5.68837-3.660897-9.835104-1.7986-4.146725 1.862308-6.471533 5.690953-5.18929 8.546072 1.28225 2.85513 5.68837 3.660898 9.835103 1.7986.25917-.116393.525184-.21464.769696-1.425677z"
      />
      <path strokeWidth="1.2" d="M16.026564 29.56774v-44.670396" />
    </g>
  );
};

const EighthNote = () => {
  return (
    <g transform="scale(0.75), translate(15, 13)">
      <path
        strokeWidth={0}
        d="M2.232 35.71C-1.12 32.7.712 27.794 6.248 24.97c1.846-.942 3.208-1.35 5.643-1.278 1.478.038 3.177.89 3.177.89 0-10.834-.04-31.37-.04-41.49.6.002.984-.005 1.824-.005 0 .595-.007 1.023-.007 1.55 0 .516.036.85.086 1.173.58 3.78 1.427 5.267 5.652 9.938 5.345 5.908 6.897 9.466 6.865 14.19-.03 4.434-3.93 13.93-4.815 13.535 1.233-3.322 2.895-6.905 3.337-9.904.54-3.665-.95-8.837-3.345-11.565-1.97-2.244-6.508-4.25-7.746-4.25 0 0-.053 21.822-.053 30.096 0 1.426-1.29 3.842-2.018 4.71-3.317 3.96-9.68 5.754-12.578 3.15z"
      />
    </g>
  );
};

const SixteenthNote = () => {
  return (
    <g transform="scale(0.8), translate(15, 10)">
      <g transform="matrix(.125 0 0 .125 -4 -12.5)">
        <ellipse
          transform="rotate(-23 83.5 335.5)"
          cx="83.5"
          cy="340.5"
          rx="72.5"
          ry="46.5"
        />
        <path d="M149.5 6v323.05V6z" strokeWidth={10} />
        <path d="M149.5 6v323.05V6zM213.92406 101.04561c-28.59228-38.14294-59.86623-45.92692-59.86623-45.92692V7.6224c0 .91303-4.33153 7.27183 12.56624 26.3776 2.52347 2.8532 10.00702 9.9108 51.7437 45.57988 6.67432 5.70403 51.64764 73.4412 27.23124 114.88894l-6.03174-8.987c5.255-10.278 2.94907-46.29325-25.6432-84.4362z" />
        <path d="M221.992 194.508c-23.1-27.952-68.09-39.207-68.09-39.207V77.51c0-5.047-.226 25.933 9.935 34.676 29.577 25.452 38.977 36.87 58.155 52.676 53.52 44.11 20.69 123.34 17.62 146.345H228.1c2.64-8.537 22.23-82.41-6.106-116.7z" />
      </g>
    </g>
  );
};

const RestButton = () => (
  <g transform="scale(1.2), translate(11, 6)">
    <path
      strokeWidth={0}
      d="M3.576.56c-.247.105-.394.465-.28.717.033.036.39.464.75.936.824.927.964 1.147 1.146 1.575.718 1.47.324 3.34-.934 4.522-.106.14-.57.532-1.006.856-1.25 1.077-1.827 1.69-2.04 2.23-.077.14-.077.28-.077.5-.034.498 0 .54 1.478 2.256 2.003 2.405 3.438 4.092 3.55 4.198l.106.104-.144-.07c-1.976-.822-4.197-1.217-4.95-.857a.854.854 0 0 0-.506.5c-.29.61-.21 1.51.22 2.832.392 1.185 1.18 2.76 1.967 3.943.324.506.936 1.292 1.006 1.328.106.107.254.07.358 0 .108-.14.108-.253-.102-.497-.753-1.077-1.11-3.305-.683-4.488.175-.533.395-.822.787-1.004 1.04-.464 3.34.11 4.305 1.075.07.072.218.22.288.254.254.106.612-.034.718-.288.15-.254.07-.428-.253-.822-.605-.717-2.433-2.87-2.685-3.192-.648-.752-.936-1.468-1.007-2.368-.034-1.148.43-2.363 1.295-3.16.105-.14.57-.533 1-.855 1.328-1.113 1.87-1.723 2.08-2.3.148-.465.078-.894-.246-1.288-.112-.104-1.365-1.652-2.833-3.41C4.87 1.427 4.154.562 4.05.527a.736.736 0 0 0-.47.035z"
    />
  </g>
);

const DottedButton = () => <circle cx={19} cy={30} r={3} />;

const TupletButton = () => (
  <g transform="scale(1.2), translate(11, 23)">
    <text strokeWidth={0} y={0} className={css(styles.tuplet)}>
      3
    </text>
  </g>
);

const TremoloButton = () => (
  <g transform="scale(1.0), translate(8, 13)">
    <path
      strokeWidth={0}
      d="M17.025 0L4.538 6.412V3.375l12.487-6.412m0 8.55L4.538 11.925V8.887l12.487-6.412m0 8.55L4.538 17.437V14.4l12.487-6.413"
    />
  </g>
);

const TrillButton = () => (
  <g transform="scale(0.9), translate(8, 20)">
    <text strokeWidth={0} y={7} className={css(styles.trill)}>
      tr
    </text>
    <path
      strokeWidth={0}
      d="M25.912 1.896c.128-.144.288-.216.512-.216.352 0 .64.216.64.48 0 .096-.032.192-.096.264-.992 1.128-1.984 2.232-2.976 3.36-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168l-3.136-2.856-2.496 2.808c-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168l-3.168-2.856c-.32.384-.672.744-.992 1.128-.128.144-.288.216-.512.216-.352 0-.64-.216-.64-.48 0-.096.032-.192.096-.264.992-1.128 1.984-2.232 2.976-3.36.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.136 2.856L20.728.216c.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.168 2.856c.32-.384.672-.744.992-1.128z"
    />
  </g>
);

const VibratoButton = () => (
  <g transform="scale(0.9), translate(10, 20)">
    <path
      strokeWidth={0}
      d="M14.912 1.896c.128-.144.288-.216.512-.216.352 0 .64.216.64.48 0 .096-.032.192-.096.264-.992 1.128-1.984 2.232-2.976 3.36-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168L8.832 2.976 6.336 5.784c-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168L2.144 2.976c-.32.384-.672.744-.992 1.128-.128.144-.288.216-.512.216-.352 0-.64-.216-.64-.48 0-.096.032-.192.096-.264.992-1.128 1.984-2.232 2.976-3.36C3.2.072 3.392 0 3.616 0c.192 0 .352.048.48.168l3.136 2.856L9.728.216c.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.168 2.856c.32-.384.672-.744.992-1.128z"
    />
    <path
      strokeWidth={0}
      d="M27.912 1.896c.128-.144.288-.216.512-.216.352 0 .64.216.64.48 0 .096-.032.192-.096.264-.992 1.128-1.984 2.232-2.976 3.36-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168l-3.136-2.856-2.496 2.808c-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168l-3.168-2.856c-.32.384-.672.744-.992 1.128-.128.144-.288.216-.512.216-.352 0-.64-.216-.64-.48 0-.096.032-.192.096-.264.992-1.128 1.984-2.232 2.976-3.36.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.136 2.856L22.728.216c.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.168 2.856c.32-.384.672-.744.992-1.128z"
    />
  </g>
);

class SidebarButton extends PureComponent {
  onClick = () => {
    if (this.props.duration) {
      this.props.changeNoteLength(this.props.cursor, this.props.duration);
    } else if (this.props.rest) {
      this.props.makeNoteRest(this.props.cursor);
    } else if (this.props.dot) {
      this.props.toggleNoteDotted(this.props.cursor);
    } else if (this.props.tuplet) {
      if (this.props.currentNote.tuplet) {
        this.props.setNoteTuplet(this.props.cursor, undefined);
      } else {
        this.props.setNoteTuplet(this.props.cursor, '2/3');
      }
    } else if (this.props.tremolo) {
      this.props.toggleNoteTremolo(this.props.cursor);
    } else if (this.props.trill) {
      this.props.toggleNoteTrill(this.props.cursor);
    } else if (this.props.vibrato) {
      this.props.toggleNoteVibrato(this.props.cursor);
    }
  };

  getSvgForType(duration) {
    if (duration) {
      switch (duration) {
        case 'w':
          return <WholeNote />;
        case 'h':
          return <HalfNote />;
        case 'q':
          return <QuarterNote />;
        case 'e':
          return <EighthNote />;
        case 's':
          return <SixteenthNote />;
        default:
          return <SixteenthNote />;
      }
    } else if (this.props.rest) {
      return <RestButton />;
    } else if (this.props.dot) {
      return <DottedButton />;
    } else if (this.props.tuplet) {
      return <TupletButton />;
    } else if (this.props.tremolo) {
      return <TremoloButton />;
    } else if (this.props.trill) {
      return <TrillButton />;
    } else if (this.props.vibrato) {
      return <VibratoButton />;
    }
  }

  render() {
    const { selected, duration } = this.props;
    const icon = this.getSvgForType(duration);

    return (
      <svg
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
        width={40}
        height={50}
        className={css(styles.button, selected && styles.selected)}
      >
        {icon}
      </svg>
    );
  }
}

const isButtonSelected = (state, props, currentNote) => {
  if (state.selectRange || !currentNote) {
    return false;
  }
  if (props.duration) {
    return props.duration === currentNote.duration;
  } else if (props.rest) {
    return currentNote.fret[0] === 'rest';
  } else if (props.dot) {
    return currentNote.dotted;
  } else if (props.tuplet) {
    return currentNote.tuplet;
  } else if (props.tremolo) {
    return currentNote.tremolo;
  } else if (props.trill) {
    return currentNote.trill;
  } else if (props.vibrato) {
    return currentNote.vibrato;
  }
};

const currentNoteSelector = (state, ownProps) => {
  const { cursor, currentTrackIndex, tracks } = state;
  const currentNote =
    tracks.present[currentTrackIndex].measures[cursor.measureIndex].notes[
      cursor.noteIndex
    ];
  return {
    cursor,
    selected: isButtonSelected(state, ownProps, currentNote),
    currentNote
  };
};

export default connect(currentNoteSelector, {
  changeNoteLength,
  makeNoteRest,
  toggleNoteDotted,
  setNoteTuplet,
  toggleNoteTremolo,
  toggleNoteTrill,
  toggleNoteVibrato
})(SidebarButton);
