import React from "react";
import {
  Platform,
  requireNativeComponent,
  ViewProps,
  StyleSheet,
} from "react-native";

const AndroidPaneView = requireNativeComponent<ViewProps>("RCA11yPaneView");

export const PaneView: React.FC = ({ children }) =>
  Platform.select({
    android: (
      <AndroidPaneView style={paneViewStyles.container}>
        {children}
      </AndroidPaneView>
    ),
    default: <>{children}</>,
  });

const paneViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
