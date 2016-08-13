import React, { PureComponent } from 'react';

export default class ClickArea extends PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    return this.props.onClick(this.props.noteIndex, this.props.stringIndex);
  }

  render() {
    const { x, y } = this.props;

    return <rect onClick={this.onClick} x={x-14} y={y-11} height={15} width={45} opacity={0}></rect>;
  }
}
