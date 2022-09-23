/**
 * @format
 */

import "react-native";
import React from "react";
import renderer from "react-test-renderer";
import { App } from "../App";

// Note: test renderer must be required after react-native.

// eslint-disable-next-line jest/expect-expect
it("renders correctly", () => {
  renderer.create(<App />);
});
