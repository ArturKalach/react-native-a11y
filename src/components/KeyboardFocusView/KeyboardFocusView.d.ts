import { View, ViewProps } from "react-native";

import { KeyboardFocusViewProps } from "./RCA11yFocusWrapper";

declare const KeyboardFocusView: React.ForwardRefExoticComponent<
  ViewProps & KeyboardFocusViewProps & React.RefAttributes<View>
>;
