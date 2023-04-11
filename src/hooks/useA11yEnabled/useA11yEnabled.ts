import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export const useA11yEnabled = () => {
  const [state, setState] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setState);
    const listener = AccessibilityInfo.addEventListener(
      "accessibilityServiceChanged",
      setState,
    );
    return listener.remove;
  }, []);

  return state;
};
