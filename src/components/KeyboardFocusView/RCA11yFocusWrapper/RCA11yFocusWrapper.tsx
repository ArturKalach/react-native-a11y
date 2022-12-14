import { requireNativeComponent } from "react-native";
import { FocusWrapperProps } from "./RCA11yFocusWrapper.types";

const ComponentName = "RCA11yFocusWrapper";

export const NativeFocusWrapper =
  requireNativeComponent<FocusWrapperProps>(ComponentName);
