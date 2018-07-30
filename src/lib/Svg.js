/* @flow */

import * as React from "react";

type Props = {
  children?: React.Node,
  forwardedRef?: React.Ref<"svg">,
  [key: string]: any
};

type State = {
  viewBox: ?string
};

export const Context = React.createContext();

class Svg extends React.Component<Props, State> {
  state = {
    viewBox: undefined
  };

  _setViewBox(viewBox) {
    this.setState({ viewBox });
  }

  _context = {
    setViewBox: this._setViewBox.bind(this)
  };

  _href = null;

  render() {
    const { children, viewBox, forwardedRef, ...props } = this.props;
    return (
      <svg
        viewBox={viewBox || this.state.viewBox}
        ref={forwardedRef}
        {...props}
      >
        <Context.Provider value={this._context}>{children}</Context.Provider>
      </svg>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <Svg {...props} forwardedRef={ref} />
));
