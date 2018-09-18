import React from "react";
import ReactDOMServer from "react-dom/server";
import Use from "../Use";
import Svg from "../Svg";
import { render } from "react-testing-library";
import fetchMock, { MATCHED, UNMATCHED } from "fetch-mock";
import { resetCache } from "../getCache";

beforeEach(resetCache);

fetchMock.config.warnOnFallback = false;

describe("Use polyfill", () => {
  describe("without external URL", () => {
    test("should render a <use> element", () => {
      const { container } = render(<Use />);
      expect(container.firstChild).toMatchSnapshot();
    });
    test("renders a local xlink:href", () => {
      const { container } = render(<Use xlinkHref="#foo" />);
      expect(container.firstChild).toMatchSnapshot();
    });
    test("renders a local href", () => {
      const { container } = render(<Use href="#foo" />);
      expect(container.firstChild).toMatchSnapshot();
    });
    test("renders both types of xlink:href", () => {
      const { container } = render(<Use xlinkHref="#foo" />);
      expect(container.firstChild).toMatchSnapshot();
    });
    test("should pass through attributes", () => {
      const { container } = render(<Use data-foo="bar" viewBox="0 0 1 1" />);
      expect(container.firstChild).toMatchSnapshot();
    });
    test("should expose a <use> ref", () => {
      const ref = React.createRef();

      render(<Use ref={ref} />);
      expect(ref.current).toBeInstanceOf(Element);
      expect(ref.current.tagName).toMatch(/^use$/i);
    });
  });
  describe("with external URL", () => {
    // NOTE: This assumes Jest's testURL is set to the default of "http://localhost"
    beforeEach(() => {
      fetchMock.getOnce(
        (url, opts) =>
          url === "http://localhost/sprites.svg" && opts.mode === "same-origin",
        {
          headers: {
            "content-type": "image/svg+xml"
          },
          body: ReactDOMServer.renderToStaticMarkup(
            <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
              <symbol viewBox="0 0 20 20" id="symbol-1">
                <circle cx="10" cy="10" r="10" stroke="black" fill="red" />
              </symbol>
              <symbol id="symbol-2">
                <ellipse
                  cx="10"
                  cy="10"
                  rx="10"
                  ry="5"
                  stroke="black"
                  fill="red"
                />
              </symbol>
            </svg>
          )
        }
      );
      fetchMock.getOnce(
        (url, opts) =>
          url === "http://localhost/sprites-slow.svg" &&
          opts.mode === "same-origin",
        async () => {
          await new Promise(resolve => setTimeout(resolve, 200));
          return {
            headers: {
              "content-type": "image/svg+xml"
            },
            body: ReactDOMServer.renderToStaticMarkup(
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "none" }}
              >
                <symbol viewBox="0 0 20 20" id="symbol-slow-1">
                  <circle cx="10" cy="10" r="10" stroke="green" fill="yellow" />
                </symbol>
              </svg>
            )
          };
        }
      );
      fetchMock.getOnce(
        (url, opts) =>
          url === "http://localhost/sprites-404.svg" &&
          opts.mode === "same-origin",
        404
      );
    });
    afterEach(() => {
      fetchMock.reset();
    });
    test("should request the external resource via href", async () => {
      render(
        <Svg>
          <Use href="http://localhost/sprites.svg#symbol-1" />
        </Svg>
      );
      await fetchMock.flush();
      expect(fetchMock.called(MATCHED)).toBe(true);
    });
    test("should request the external resource via xlinkHref", async () => {
      render(
        <Svg>
          <Use xlinkHref="http://localhost/sprites.svg#symbol-1" />
        </Svg>
      );
      await fetchMock.flush();
      expect(fetchMock.called(MATCHED)).toBe(true);
    });
    test("should prefer the href prop when requesting a resource", async () => {
      render(
        <Svg>
          <Use
            href="http://localhost/sprites.svg#symbol-1"
            xlinkHref="http://localhost/sprites-nope.svg#symbol-1"
          />
        </Svg>
      );
      await fetchMock.flush();
      expect(fetchMock.called(MATCHED)).toBe(true);
      expect(fetchMock.called(UNMATCHED)).toBe(false);
    });
    test("should not request a cross-origin resource", async () => {
      render(
        <Svg>
          <Use href="http://www.example.com/sprites.svg#symbol-1" />
        </Svg>
      );
      await fetchMock.flush();
      expect(fetchMock.called(MATCHED)).toBe(false);
    });
    describe("emulating missing location.origin", () => {
      // IE 11 doesn't support location.origin
      beforeAll(() => {
        const originProp = Object.getOwnPropertyDescriptor(
          window.location,
          "origin"
        );
        Object.defineProperty(window.location, "origin", {
          configurable: true,
          value: undefined
        });
      });
      afterAll(() => {
        delete window.location.origin;
        if (originProp) {
          Object.defineProperty(window.location, "origin", originProp);
        }
      });
      test("should not request a cross-origin resource", async () => {
        render(
          <Svg>
            <Use href="http://www.example.com/sprites.svg#symbol-1" />
          </Svg>
        );
        await fetchMock.flush();
        expect(fetchMock.called(MATCHED)).toBe(false);
      });
    });
    test.skip("should cache the external resource across synchronous renders", async () => {
      // FIXME: This inadvertently hits an edge case where rerendering before the response is fully
      // handled causes an unintended cache miss. TODO: Rewrite internals to use DataLoader
      // instead.
      const { rerender } = render(
        <Svg>
          <Use href="http://localhost/sprites.svg#symbol-1" />
        </Svg>
      );
      rerender(
        <Svg>
          <Use href="http://localhost/sprites.svg#symbol-nope" />
        </Svg>
      );
      await fetchMock.flush();
      expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    });
    test("should cache the external resource across renders", async () => {
      const { rerender } = render(
        <Svg>
          <Use href="http://localhost/sprites.svg#symbol-1" />
        </Svg>
      );
      await fetchMock.flush();
      await Promise.resolve();
      rerender(
        <Svg>
          <Use href="http://localhost/sprites.svg#symbol-nope" />
        </Svg>
      );
      await fetchMock.flush();
      expect(fetchMock.calls(MATCHED)).toHaveLength(1);
    });
    test("should render a plain <use> tag while loading", () => {
      const { container } = render(
        <Svg>
          <Use href="http://localhost/sprites.svg#symbol-1" />
        </Svg>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
    test("should embed the referenced symbol in the output", async () => {
      const { container } = render(
        <Svg>
          <Use href="http://localhost/sprites.svg#symbol-1" />
        </Svg>
      );
      await fetchMock.flush();
      await Promise.resolve(); // Let components handle response
      expect(container.firstChild).toMatchSnapshot();
    });
    test("should pass props through to the embedded symbol", async () => {
      const { container } = render(
        <Svg>
          <Use href="http://localhost/sprites.svg#symbol-1" data-foo="bar" />
        </Svg>
      );
      await fetchMock.flush();
      await Promise.resolve(); // Let components handle response
      expect(container.firstChild).toMatchSnapshot();
    });
    test("should expose a <g> ref once loaded", async () => {
      const ref = React.createRef();
      render(
        <Svg>
          <Use ref={ref} href="http://localhost/sprites.svg#symbol-1" />
        </Svg>
      );
      await fetchMock.flush();
      await Promise.resolve(); // Let components handle response
      expect(ref.current).toBeInstanceOf(Element);
      expect(ref.current.tagName).toMatch(/^g$/i);
    });
    test("should output <g /> if the referenced symbol doesn't exist", async () => {
      const { container } = render(
        <Svg>
          <Use href="http://localhost/sprites.svg#symbol-nope" />
        </Svg>
      );
      await fetchMock.flush();
      await Promise.resolve(); // Let components handle response
      expect(container.firstChild).toMatchSnapshot();
    });
    test("should fall back to <use /> if the request hits a network error", async () => {
      const { container } = render(
        <Svg>
          <Use href="http://localhost/sprites-nope.svg" />
        </Svg>
      );
      await fetchMock.flush();
      await Promise.resolve(); // Let components handle response
      expect(container.firstChild).toMatchSnapshot();
    });
    test("should fall back to <use /> if the request hits a 404", async () => {
      const { container } = render(
        <Svg>
          <Use href="http://localhost/sprites-404.svg" />
        </Svg>
      );
      await fetchMock.flush();
      await Promise.resolve(); // Let components handle response
      expect(container.firstChild).toMatchSnapshot();
    });
    test("should not change if rerendering with the same href", async () => {
      const { container, rerender } = render(
        <Svg>
          <Use href="http://localhost/sprites.svg#symbol-1" />
        </Svg>
      );
      await fetchMock.flush();
      await Promise.resolve(); // Let components handle response
      const reference = container.cloneNode(true);
      rerender(
        <Svg>
          <Use
            // Change the prop from href to xlinkHref to force a (shallow) rerender
            xlinkHref="http://localhost/sprites.svg#symbol-1"
          />
        </Svg>
      );
      // Guard against a flash of blank content because of the rerender.
      expect(container).toContainHTML(reference.innerHTML);

      // Guard against an async load getting triggered at all.
      await fetchMock.flush();
      await Promise.resolve();
      expect(fetchMock.called(UNMATCHED)).toBe(false);
      expect(container).toContainHTML(reference.innerHTML);
    });
    test("tracks the latest href despite another fetch completing later", async () => {
      const { container, rerender } = render(
        <Svg>
          <Use href="http://localhost/sprites-slow.svg#symbol-slow-1" />
        </Svg>
      );
      rerender(
        <Svg>
          <Use href="http://localhost/sprites.svg#symbol-1" />
        </Svg>
      );
      await fetchMock.flush();
      expect(fetchMock.calls(MATCHED)).toHaveLength(2);
      await Promise.resolve(); // Let components handle response
      expect(container.firstChild).toMatchSnapshot();
    });
    test("tracks the latest href despite another fetch completing sooner", async () => {
      const { container, rerender } = render(
        <Svg>
          <Use href="http://localhost/sprites.svg#symbol-1" />
        </Svg>
      );
      rerender(
        <Svg>
          <Use href="http://localhost/sprites-slow.svg#symbol-slow-1" />
        </Svg>
      );
      await fetchMock.flush();
      expect(fetchMock.calls(MATCHED)).toHaveLength(2);
      await Promise.resolve(); // Let components handle response
      expect(container.firstChild).toMatchSnapshot();
    });
    describe("viewBox", () => {
      test("should set and clear as appropriate", async () => {
        const { container, rerender } = render(
          <Svg>
            <Use href="http://localhost/sprites.svg#symbol-1" />
          </Svg>
        );
        await fetchMock.flush();
        await Promise.resolve(); // Let components handle response
        expect(container.firstChild).toMatchSnapshot();
        rerender(
          <Svg>
            <Use href="http://localhost/sprites.svg#symbol-2" />
          </Svg>
        );
        await fetchMock.flush();
        await Promise.resolve(); // Let components handle response
        expect(container.firstChild).toMatchSnapshot();
      });
      test("should not override Svg's viewBox", async () => {
        const { container, rerender } = render(
          <Svg viewBox="1 2 3 4">
            <Use href="http://localhost/sprites.svg#symbol-1" />
          </Svg>
        );
        await fetchMock.flush();
        await Promise.resolve(); // Let components handle response
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });
});
