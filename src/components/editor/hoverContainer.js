import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

const selectedColor = '#b3caf5';

const hoverStyle = {
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  cursor: 'pointer'
};

const defaultStyle = {};

export default function hover() {
  return function(WrappedComponent) {
    return class HoverContainer extends Component {
      constructor(props) {
        super(props);

        this.state = { hover: false };

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
      }

      shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }

      onMouseEnter() {
        this.setState({ hover: true });
      }

      onMouseLeave() {
        this.setState({ hover: false });
      }

      render() {
        const style = this.state.hover ? hoverStyle : defaultStyle;
        const color = (this.props.selected || this.state.hover) ? selectedColor : 'black';
        const styleToUse = this.props.style ? { ...this.props.style, ...style } : style;

        return (
          <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            <WrappedComponent {...this.props} color={color} style={styleToUse} />
          </div>
        );
      }
    };
  };
}
