import UsePolyfill from "./Use";
import SvgPolyfill from "./Svg";

import shouldPolyfill from "./shouldPolyfill";

export const Use = shouldPolyfill ? UsePolyfill : "use";
export const Svg = shouldPolyfill ? SvgPolyfill : "svg";
