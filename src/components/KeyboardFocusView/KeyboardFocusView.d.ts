import { View } from "react-native";

import { FocusWrapperProps } from "./RCA11yFocusWrapper";

declare const KeyboardFocusView: React.ForwardRefExoticComponent<
  FocusWrapperProps & React.RefAttributes<View>
>;
