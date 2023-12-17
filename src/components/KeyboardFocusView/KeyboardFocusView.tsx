import { View } from "react-native";

import { KeyboardFocusViewProps } from "./KeyboardFocusView.types";

export const KeyboardFocusView =
  View as unknown as React.ForwardRefExoticComponent<
    KeyboardFocusViewProps & React.RefAttributes<View>
  >;
