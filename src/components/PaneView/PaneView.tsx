import React, { type PropsWithChildren } from 'react';
import {
  Platform,
  requireNativeComponent,
  type ViewProps,
  StyleSheet,
} from 'react-native';

const AndroidPaneView = requireNativeComponent<ViewProps>('RCA11yPaneView');

export const PaneView: React.FC<PropsWithChildren<{}>> = ({ children }) =>
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
