import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { changeNoteLength } from '../../actions/measure';

const selectedColor = '#b3caf5';

const hoverStyle = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  cursor: 'pointer'
};

const WholeNote = ({ color }) => {
  return (
    <g transform='scale(0.8), translate(15, 8)'>
      <path strokeOpacity='0.2' stroke='grey' fill={color}
        d='M12.768 35.447c-3.296-.174-5.872-3.1-6.906-6.127-.626-1.776-.282-4.44 1.804-4.94 3.023-.513 5.53 2.055 6.937 4.513 1.002 1.822 1.555 4.692-.322 6.137-.445.3-.984.42-1.512.417zm5.252-10.374c-3.714-2.256-8.406-2.432-12.473-1.17C2.97 24.804.024 26.72 0 29.84c-.002 3.055 2.842 4.96 5.358 5.87 3.983 1.302 8.58 1.187 12.298-.89 2.106-1.12 3.972-3.44 3.34-6.01-.35-1.653-1.615-2.89-2.976-3.737z'/>
    </g>
  );
};

const HalfNote = ({ color }) => {
  return (
    <g transform='scale(0.8), translate(15, 10)'>
      <path fill={color} d='M12.22 34.28c3.668-1.964 5.622-5.522 4.42-8.198-1.282-2.856-5.69-3.66-9.835-1.8-4.147 1.863-6.47 5.692-5.188 8.547 1.282 2.855 5.688 3.66 9.834 1.8.26-.118.527-.217.77-.347zm-1.2-2.42c-.258.135-.522.235-.798.36-3.536 1.587-6.95 1.663-7.62.166-.673-1.494 1.65-3.996 5.186-5.584 3.536-1.587 6.95-1.663 7.62-.166.62 1.378-1.31 3.64-4.386 5.225z'/>
      <path strokeWidth='1.2' stroke={color} d='M16.110564 29.86774v-44.670396' />
    </g>
  );
};

const QuarterNote = ({ color }) => {
  return (
    <g transform='scale(0.8), translate(15, 10)'>
      <path fill={color} d='M11.980408 34.601027c3.667507-1.965567 5.621702-5.523714 4.419597-8.200397-1.28224-2.85513-5.68837-3.660897-9.835104-1.7986-4.146725 1.862308-6.471533 5.690953-5.18929 8.546072 1.28225 2.85513 5.68837 3.660898 9.835103 1.7986.25917-.116393.525184-.21464.769696-1.425677z'/>
      <path strokeWidth='1.2' stroke={color} d='M16.026564 29.56774v-44.670396' />
    </g>
  );
};

const EighthNote = ({ color }) => {
  return (
    <g transform='scale(0.75), translate(15, 13)'>
      <path fill={color} d='M2.232 35.71C-1.12 32.7.712 27.794 6.248 24.97c1.846-.942 3.208-1.35 5.643-1.278 1.478.038 3.177.89 3.177.89 0-10.834-.04-31.37-.04-41.49.6.002.984-.005 1.824-.005 0 .595-.007 1.023-.007 1.55 0 .516.036.85.086 1.173.58 3.78 1.427 5.267 5.652 9.938 5.345 5.908 6.897 9.466 6.865 14.19-.03 4.434-3.93 13.93-4.815 13.535 1.233-3.322 2.895-6.905 3.337-9.904.54-3.665-.95-8.837-3.345-11.565-1.97-2.244-6.508-4.25-7.746-4.25 0 0-.053 21.822-.053 30.096 0 1.426-1.29 3.842-2.018 4.71-3.317 3.96-9.68 5.754-12.578 3.15z'/>
    </g>
  );
};

const SixteenthNote = ({ color }) => {
  return (
    <g transform='scale(0.8), translate(15, 10)'>
      <g transform='matrix(.125 0 0 .125 -4 -12.5)'>
        <ellipse stroke={color} fill={color} transform='rotate(-23 83.5 335.5)' cx='83.5' cy='340.5' rx='72.5' ry='46.5' />
        <path d='M149.5 6v323.05V6z' stroke={color} strokeWidth='10'/>
        <path d='M149.5 6v323.05V6zM213.92406 101.04561c-28.59228-38.14294-59.86623-45.92692-59.86623-45.92692V7.6224c0 .91303-4.33153 7.27183 12.56624 26.3776 2.52347 2.8532 10.00702 9.9108 51.7437 45.57988 6.67432 5.70403 51.64764 73.4412 27.23124 114.88894l-6.03174-8.987c5.255-10.278 2.94907-46.29325-25.6432-84.4362z' stroke={color} fill={color}></path>
        <path d='M221.992 194.508c-23.1-27.952-68.09-39.207-68.09-39.207V77.51c0-5.047-.226 25.933 9.935 34.676 29.577 25.452 38.977 36.87 58.155 52.676 53.52 44.11 20.69 123.34 17.62 146.345H228.1c2.64-8.537 22.23-82.41-6.106-116.7z' stroke={color} fill={color}></path>
      </g>
    </g>
  );
};

class NoteIcon extends Component {
  constructor(props) {
    super(props);

    this.state = { hover: false };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onMouseEnter() {
    this.setState({ hover: true });
  }

  onMouseLeave() {
    this.setState({ hover: false });
  }

  onClick() {
    this.props.changeNoteLength(this.props.cursor, this.props.duration);
  }

  getNoteSvgForType(type, color) {
    switch(type) {
      case 'w':
        return <WholeNote color={color}/>;
      case 'h':
        return <HalfNote color={color}/>;
      case 'q':
        return <QuarterNote color={color}/>;
      case 'e':
        return <EighthNote color={color}/>;
      case 's':
        return <SixteenthNote color={color}/>;
      default:
        return <SixteenthNote color={color}/>;
    }
  }

  render() {
    const style = this.state.hover ? hoverStyle : {};
    const color = (this.props.selected || this.state.hover) ? selectedColor : 'black';
    const note = this.getNoteSvgForType(this.props.duration, color);

    return (
      <svg onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={this.onClick}
        width='40' height='40' style={style}>
        {note}
      </svg>
    );
  }
}

const currentNoteSelector = (state, ownProps) => {
  const { selectRange, cursor, currentTrackIndex, tracks } = state.present;
  const cursorNote = tracks[currentTrackIndex].measures[cursor.measureIndex].notes[cursor.noteIndex];
  return {
    cursor,
    selected : selectRange ? false : ownProps.duration === cursorNote.duration
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeNoteLength: bindActionCreators(changeNoteLength, dispatch)
  };
};

export default connect(currentNoteSelector, mapDispatchToProps)(NoteIcon);
