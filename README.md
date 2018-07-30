# react-svg-use-external

[![Build Status](https://travis-ci.com/digital-detox/react-svg-use-external.svg?branch=master)](https://travis-ci.com/digital-detox/react-svg-use-external)
[![Code coverage](https://img.shields.io/codecov/c/github/digital-detox/react-svg-use-external/master.svg)](https://codecov.io/gh/digital-detox/react-svg-use-external)
[![npm](https://img.shields.io/npm/v/@digital-detox/react-svg-use-external.svg)](https://www.npmjs.com/package/@digital-detox/react-svg-use-external)

A React library that enables external SVG `<use>` references in all browsers that support SVG.

Check out the [demo](https://react-svg-use-external.netlify.com/).

Inspired by [SVG for Everybody](https://github.com/jonathantneal/svg4everybody).

## Usage

In your React SVG rendering code, replace `<svg>` and `<use>` with `<Svg>` and `<Use>` from this library:

```jsx
import { Svg, Use } from "@digital-detox/react-svg-use-external";

<Svg
  style={{
    width: 64,
    height: 64,
    display: "inline-block",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: ".4em",
    verticalAlign: "middle"
  }}
>
  <Use xlinkHref="/static/sprites.svg#icon-close" />
</Svg>;
```

These components are drop-in replacements for the `<svg>` and `<use>` React DOM intrinsics, supporting the exact same props. In fact, on browsers that don't need the polyfill, you'll find that `Svg === "svg"` and `Use === "use"`.

In the rare case you need to access the underlying DOM elements, `<Svg>` and `<Use>` have you covered by the use of [ref forwarding][]. Note that `<Use>` may render a `<g>` (`SVGGElement`) instance and not necessarily an actual `SVGUseElement` when the polyfill is active.

[ref forwarding]: https://reactjs.org/docs/forwarding-refs.html

## Browser support

This library supports IE 9 and up and should generally match [svg4everybody's browser support](https://github.com/jonathantneal/svg4everybody#implementation-status) as it uses similar techniques underneath. Polyfills for `fetch`, `Promise` and `Map` are required in environments that don't support these APIs.

## Differences from `svg4everybody`

- There is no fallback to `<img>` (and hence no support for IE < 9).
- `<use>` references (internal or external) in the imported SVG content aren't resolved recursively ([#5](https://github.com/digital-detox/react-svg-use-external/issues/5)).
- This polyfill observes the strict same-origin policy that all modern browsers apply to `<use>` references (ignoring CORS headers), as formally specified in [SVG 2][].

[svg 2]: https://www.w3.org/TR/SVG2/struct.html#UseElementHrefAttribute
