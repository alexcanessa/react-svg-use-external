import React from "react";
import Svg from "../Svg";
import { render } from "react-testing-library";

describe("Svg", () => {
  test("should render an <svg> element", () => {
    const { container } = render(<Svg />);
    expect(container.firstChild).toMatchSnapshot();
  });
  test("should pass through attributes and children", () => {
    const { container } = render(
      <Svg data-foo="bar" viewBox="0 0 1 1">
        <g />
        <circle />
      </Svg>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  test("should expose an <svg> ref", () => {
    const ref = React.createRef();

    render(<Svg ref={ref} />);
    expect(ref.current).toBeInstanceOf(Element);
    expect(ref.current.tagName).toMatch(/^svg$/i);
  });
});
