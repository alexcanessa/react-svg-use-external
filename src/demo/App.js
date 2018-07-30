import React, { Component } from "react";
import "./App.css";
import { Svg, Use } from "../lib";
import spriteSvg from "entypo/dist/sprite.svg";
import * as Force from "./forcePolyfill";

const icons = ["entypo-code", "entypo-browser", "entypo-link", "entypo-image"];

class App extends Component {
  state = {
    activeIcon: "entypo-code"
  };

  _handleChange = e => {
    this.setState({ activeIcon: e.target.value });
  };

  render() {
    const { activeIcon } = this.state;
    const isPolyfill = typeof Svg !== "string";
    return (
      <div className="App">
        <h1 className="Heading">react-svg-use-external demo</h1>
        <div className="SelectArea">
          <h2>Sprite:</h2>{" "}
          <select value={activeIcon} onChange={this._handleChange}>
            {icons.map(icon => (
              <option key={icon}>{icon}</option>
            ))}
          </select>
        </div>
        <div className="DemoArea">
          <h2>Mode = {isPolyfill ? "Polyfill" : "Native"}:</h2>
          <Svg
            style={{
              width: "3em",
              height: "3em"
            }}
          >
            <Use xlinkHref={spriteSvg + "#" + activeIcon} />
          </Svg>
        </div>
        {isPolyfill ? null : (
          <div className="DemoArea">
            <h2>Mode = Polyfill (force):</h2>
            <Force.Svg
              style={{
                width: "3em",
                height: "3em"
              }}
            >
              <Force.Use xlinkHref={spriteSvg + "#" + activeIcon} />
            </Force.Svg>
          </div>
        )}
      </div>
    );
  }
}

export default App;
