import shouldPolyfill from "../shouldPolyfill";
import React from "react";
import { isValidElementType } from "react-is";

describe("package entry point", () => {
  describe("when polyfilling", () => {
    beforeAll(() => {
      jest.mock("../shouldPolyfill", () => true);
      jest.resetModules();
    });
    test("should export React components", () => {
      const { Svg, Use } = require("../");
      expect(Svg).not.toBe("svg");
      expect(Use).not.toBe("use");
      expect(isValidElementType(Svg)).toBeTruthy();
      expect(isValidElementType(Use)).toBeTruthy();
    });
  });
  describe("when not polyfilling", () => {
    beforeAll(() => {
      jest.mock("../shouldPolyfill", () => false);
      jest.resetModules();
    });
    test("should export React DOM intrinsics", () => {
      const { Svg, Use } = require("../");
      expect(Svg).toBe("svg");
      expect(Use).toBe("use");
    });
  });
});
