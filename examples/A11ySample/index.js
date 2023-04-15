/**
 * @format
 */

import { AppRegistry } from "react-native";
import { App } from "./App";
import { name as appName } from "./app.json";
import "react-native-gesture-handler";

import { a11yConfig } from "react-native-a11y";

a11yConfig.init({
  a11yEventName: "screenReaderChanged",
});

AppRegistry.registerComponent(appName, () => App);
