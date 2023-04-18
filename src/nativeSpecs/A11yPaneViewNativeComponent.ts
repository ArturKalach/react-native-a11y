import type { HostComponent, ViewProps } from "react-native";
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";

export interface NativeProps extends ViewProps {
  accesibility: string;
}

export default codegenNativeComponent<NativeProps>(
  "RCA11yPaneView",
) as HostComponent<NativeProps>;
