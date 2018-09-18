/* @flow */

import * as React from "react";
import { Context } from "./Svg";
import getCache from "./getCache";
import url from "url";

type Props = {
  xlinkHref?: string,
  href?: string,
  forwardedRef?: React.Ref<"use" | "g">,
  [key: string]: any
};

type State = {
  loaded: boolean,
  content: ?Array<Node>
};

function getHref(props: Props): ?string {
  return props.href || props.xlinkHref;
}

class Use extends React.Component<Props, State> {
  state = {
    loaded: false
  };

  _href = null;

  async _load(href: ?string) {
    if (!href || href[0] === "#") {
      // Our fallback to <use> will do in these cases
      this.setState({ loaded: false, content: undefined });
      return;
    }
    if (this._href === href && this.state.loaded) {
      return;
    }
    this._href = href;
    const hrefUrl = url.parse(
      url.resolve(typeof window === "object" ? window.location.href : "", href)
    );
    const hash = hrefUrl.hash;
    hrefUrl.hash = "";
    const resource = url.format(hrefUrl);

    this.setState({
      loaded: false,
      content: undefined // Hygiene
    });

    const windowOrigin =
      window.location.origin ||
      // IE < 11
      window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ":" + window.location.port : "");

    const origin = `${hrefUrl.protocol}//${hrefUrl.host}`;

    if (typeof window === "object" && windowOrigin !== origin) {
      console.error(
        `[react-svg-use-external] Refusing to fetch cross-origin SVG ${href} from origin ${windowOrigin}. This is to align with browsers' native behaviour.`
      );
      return;
    }

    const cache = getCache();

    let parsedDocument = cache.get(resource);
    if (!parsedDocument) {
      try {
        parsedDocument = document.implementation.createHTMLDocument("");
        parsedDocument.body.innerHTML = await (await fetch(resource)).text();
        if (parsedDocument.domain !== document.domain) {
          parsedDocument.domain = document.domain;
        }
      } catch (e) {
        return; // state is either { loaded: false } or managed by a later request
      }
      cache.set(resource, parsedDocument);
    }

    if (this._href !== href) {
      return;
    }

    const template = parsedDocument.getElementById(hash.substr(1));
    if (template) {
      // TODO: Recursively flatten <use> references in `template`
      // • Do this _before_ cloning, so results can be shared as long as the document is in the cache.
      // • Do this for both local (in `parsedDocument`) and remote references.
      // • Make sure to break circular references, in line with the SVG spec.
      // • Generalise most of the code that currently makes up `Use._load`, as it is directly applicable
      //   to resolving external references from a DOM context as well.
      const {
        svgContext: { setViewBox }
      } = this.props;

      const viewBox = template.getAttribute("viewBox");
      if (viewBox) {
        setViewBox(viewBox);
      }

      const clone = template.cloneNode(true);
      const contentNodes = [];
      while (clone.childNodes.length) {
        contentNodes.push(clone.removeChild(clone.firstChild));
      }

      this.setState({ loaded: true, content: contentNodes });
    } else {
      this.setState({ loaded: true, content: undefined });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const prevHref = getHref(prevProps);
    const href = getHref(this.props);
    if (href !== prevHref) {
      this._load(href);
    }
    const element = this._element.current;
    if (this.state.loaded && element) {
      const { content } = this.state;
      if (!content || content[0] !== element.firstChild) {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        if (content) {
          for (const node of content) {
            element.appendChild(node);
          }
        }
      }
    }
  }

  componentDidMount() {
    this._load(getHref(this.props));
  }

  _element = React.createRef();

  render() {
    const { forwardedRef, svgContext, xlinkHref, href, ...props } = this.props;
    const { loaded } = this.state;
    return loaded ? (
      forwardedRef ? (
        // Can't both forward and use a ref, so wrap with another element.
        <g ref={forwardedRef} {...props}>
          <g ref={this._element} />
        </g>
      ) : (
        <g ref={this._element} {...props} />
      )
    ) : (
      <use ref={forwardedRef} xlinkHref={xlinkHref} href={href} {...props} />
    );
  }
}

export default React.forwardRef((props, ref) => (
  <Context.Consumer>
    {svgContext => (
      <Use {...props} forwardedRef={ref} svgContext={svgContext} />
    )}
  </Context.Consumer>
));
