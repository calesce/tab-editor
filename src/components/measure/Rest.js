import React, { PureComponent } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  rest: {
    overflow: 'visible',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    cursor: 'crosshair'
  }
});

const RestDot = ({ x, y, color, dotted }) =>
  dotted ? <circle cx={x} cy={y} r={1.5} fill={color} stroke={color} /> : null;

const WholeRest = ({ x, y, color, dotted, onClick }) => (
  <svg
    onClick={onClick}
    className={css(styles.rest)}
    width="30"
    height="62"
    x={x - 9}
    y={y - 5}
  >
    <g transform="scale(1.2), translate(-2, -15)">
      <g transform="matrix(1,0,0,-1,0,42.987635)">
        <rect
          fill={color}
          width="9.2204475"
          height="5.1031408"
          x="10.902164"
          y="18.913252"
        />
        <rect
          fill={color}
          width="15.077462"
          height="1.1018145"
          x="7.9446626"
          y="22.972569"
        />
      </g>
      <RestDot x={27} y={y - 24} color={color} dotted={dotted} />
    </g>
  </svg>
);

const HalfRest = ({ x, y, color, dotted, onClick }) => (
  <svg
    onClick={onClick}
    className={css(styles.rest)}
    width="30"
    height="62"
    x={x - 9}
    y={y - 12.5}
  >
    <g transform="scale(1.2), translate(-2, -3)">
      <g>
        <rect
          fill={color}
          width="9.2204475"
          height="5.1031408"
          x="10.902164"
          y="18.913252"
        />
        <rect
          fill={color}
          width="15.077462"
          height="1.1018145"
          x="7.9446626"
          y="22.972569"
        />
      </g>
      <RestDot x={27} y={y - 25} color={color} dotted={dotted} />
    </g>
  </svg>
);

const QuarterRest = ({ x, y, color, dotted, onClick }) => (
  <svg
    onClick={onClick}
    className={css(styles.rest)}
    width="30"
    height="62"
    x={x}
    y={y}
  >
    <g transform="scale(1.2), translate(0, -2)">
      <path
        fill={color}
        d="M3.576.56c-.247.105-.394.465-.28.717.033.036.39.464.75.936.824.927.964 1.147 1.146 1.575.718 1.47.324 3.34-.934 4.522-.106.14-.57.532-1.006.856-1.25 1.077-1.827 1.69-2.04 2.23-.077.14-.077.28-.077.5-.034.498 0 .54 1.478 2.256 2.003 2.405 3.438 4.092 3.55 4.198l.106.104-.144-.07c-1.976-.822-4.197-1.217-4.95-.857a.854.854 0 0 0-.506.5c-.29.61-.21 1.51.22 2.832.392 1.185 1.18 2.76 1.967 3.943.324.506.936 1.292 1.006 1.328.106.107.254.07.358 0 .108-.14.108-.253-.102-.497-.753-1.077-1.11-3.305-.683-4.488.175-.533.395-.822.787-1.004 1.04-.464 3.34.11 4.305 1.075.07.072.218.22.288.254.254.106.612-.034.718-.288.15-.254.07-.428-.253-.822-.605-.717-2.433-2.87-2.685-3.192-.648-.752-.936-1.468-1.007-2.368-.034-1.148.43-2.363 1.295-3.16.105-.14.57-.533 1-.855 1.328-1.113 1.87-1.723 2.08-2.3.148-.465.078-.894-.246-1.288-.112-.104-1.365-1.652-2.833-3.41C4.87 1.427 4.154.562 4.05.527a.736.736 0 0 0-.47.035z"
        fillRule="evenodd"
      />
      <RestDot x={14} y={y - 30} color={color} dotted={dotted} />
    </g>
  </svg>
);

const EighthRest = ({ x, y, color, dotted, onClick }) => (
  <svg
    onClick={onClick}
    className={css(styles.rest)}
    width="30"
    height="62"
    x={x}
    y={y}
  >
    <g transform="scale(1.4)">
      <g transform="translate(-482.02112,-143.11753)">
        <g transform="matrix(1.8,0,0,1.8,-471.40868,9.4615275)">
          <path
            fill={color}
            d="M 531.098,74.847 C 530.578,74.945 530.18,75.304 530,75.8 C 529.961,75.96 529.961,75.999 529.961,76.218 C 529.961,76.519 529.98,76.679 530.121,76.917 C 530.32,77.316 530.738,77.636 531.215,77.753 C 531.715,77.894 532.551,77.773 533.508,77.456 L 533.746,77.374 L 532.57,80.624 L 531.414,83.87 C 531.414,83.87 531.453,83.89 531.516,83.933 C 531.633,84.011 531.832,84.07 531.973,84.07 C 532.211,84.07 532.512,83.933 532.551,83.812 C 532.551,83.773 533.109,81.878 533.785,79.628 L 534.98,75.503 L 534.941,75.445 C 534.844,75.324 534.645,75.285 534.523,75.382 C 534.484,75.421 534.422,75.503 534.383,75.562 C 534.203,75.863 533.746,76.398 533.508,76.597 C 533.289,76.777 533.168,76.796 532.969,76.718 C 532.789,76.62 532.73,76.519 532.609,75.98 C 532.492,75.445 532.352,75.202 532.051,75.003 C 531.773,74.824 531.414,74.765 531.098,74.847 z "
            fillRule="evenodd"
          />
        </g>
      </g>
      <RestDot x={14} y={y - 30} color={color} dotted={dotted} />
    </g>
  </svg>
);

const SixteenthRest = ({ x, y, color, dotted, onClick }) => (
  <svg
    onClick={onClick}
    className={css(styles.rest)}
    width="30"
    height="62"
    x={x}
    y={y}
  >
    <g transform="scale(1.2)">
      <g transform="translate(-481.99253,-146.99198)">
        <g transform="matrix(1.8,0,0,1.8,-492.20747,10.83713)">
          <path
            fill={color}
            d="M 544.191,74.847 C 543.672,74.945 543.273,75.304 543.098,75.8 C 543.055,75.96 543.055,75.999 543.055,76.218 C 543.055,76.519 543.074,76.679 543.215,76.917 C 543.414,77.316 543.832,77.636 544.313,77.753 C 544.809,77.894 545.605,77.792 546.563,77.476 C 546.703,77.417 546.82,77.374 546.82,77.394 C 546.82,77.417 545.926,80.324 545.887,80.425 C 545.785,80.683 545.445,81.16 545.148,81.46 C 544.871,81.738 544.73,81.8 544.512,81.699 C 544.332,81.601 544.273,81.499 544.152,80.96 C 544.051,80.562 543.973,80.343 543.813,80.187 C 543.395,79.726 542.676,79.667 542.121,80.027 C 541.859,80.206 541.66,80.484 541.543,80.785 C 541.5,80.941 541.5,80.984 541.5,81.202 C 541.5,81.499 541.523,81.66 541.66,81.898 C 541.859,82.296 542.277,82.617 542.758,82.734 C 542.977,82.796 543.535,82.796 543.914,82.734 C 544.23,82.675 544.609,82.577 544.988,82.456 C 545.148,82.398 545.289,82.359 545.289,82.378 C 545.289,82.378 543.336,88.734 543.297,88.831 C 543.297,88.851 543.453,88.972 543.613,89.011 C 543.773,89.074 543.934,89.074 544.094,89.011 C 544.25,88.972 544.41,88.874 544.41,88.812 C 544.43,88.792 545.227,85.785 546.203,82.136 L 547.977,75.503 L 547.938,75.445 C 547.859,75.324 547.699,75.304 547.559,75.363 C 547.48,75.402 547.48,75.402 547.242,75.761 C 547.043,76.081 546.762,76.417 546.602,76.577 C 546.383,76.757 546.266,76.796 546.066,76.718 C 545.887,76.62 545.824,76.519 545.707,75.98 C 545.586,75.445 545.445,75.202 545.148,75.003 C 544.871,74.824 544.512,74.765 544.191,74.847 z "
            fillRule="evenodd"
          />
        </g>
      </g>
      <RestDot x={15} y={y - 30} color={color} dotted={dotted} />
    </g>
  </svg>
);

export default class Rest extends PureComponent {
  restClicked = () => {
    this.props.onClick(this.props.noteIndex, 0);
  };

  render() {
    const { y, note, color } = this.props;
    const { x, duration, dotted } = note;

    switch (duration) {
      case 'e':
        return (
          <EighthRest
            x={x}
            y={y}
            color={color}
            dotted={dotted}
            onClick={this.restClicked}
          />
        );
      case 's':
        return (
          <SixteenthRest
            x={x}
            y={y}
            color={color}
            dotted={dotted}
            onClick={this.restClicked}
          />
        );
      case 'h':
        return (
          <HalfRest
            x={x}
            y={y}
            color={color}
            dotted={dotted}
            onClick={this.restClicked}
          />
        );
      case 'w':
        return (
          <WholeRest
            x={x}
            y={y}
            color={color}
            dotted={dotted}
            onClick={this.restClicked}
          />
        );
      default:
        return (
          <QuarterRest
            x={x}
            y={y}
            color={color}
            dotted={dotted}
            onClick={this.restClicked}
          />
        );
    }
  }
}
