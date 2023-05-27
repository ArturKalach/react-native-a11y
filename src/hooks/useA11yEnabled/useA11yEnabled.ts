import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { a11yConfig } from "../../configs";

export const useA11yEnabled = () => {
  const [state, setState] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setState);
    const listener = AccessibilityInfo.addEventListener(
      a11yConfig.a11yEventName,
      setState,
    );
    return () => listener.remove();
  }, []);

  return state;
};
