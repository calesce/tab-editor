import React, { Component } from 'react';

const selectedColor = '#b3caf5';

const hoverStyle = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  cursor: 'pointer'
};

export default function hover() {
  return function(WrappedComponent) {
    return class HoverContainer extends Component {
      constructor(props) {
        super(props);

        this.state = { hover: false };

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
      }

      onMouseEnter() {
        this.setState({ hover: true });
      }

      onMouseLeave() {
        this.setState({ hover: false });
      }

      render() {
        const style = this.state.hover ? hoverStyle : {};
        const color = (this.props.selected || this.state.hover) ? selectedColor : 'black';

        return (
          <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            <WrappedComponent {...this.props} color={color} style={{ ...this.props.style, ...style }} />
          </div>
        );
      }
    };
  };
}
