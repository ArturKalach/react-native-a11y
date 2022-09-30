import { NativeModules } from "react-native";

const isTurboModuleEnabled =
  (global as unknown as { __turboModuleProxy: boolean }).__turboModuleProxy !=
  null;

const Module = isTurboModuleEnabled
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../../../nativeSpecs/NativeA11yModule").default
  : NativeModules.RCA11yModule;

export const RCA11yModule =
  Module ||
  new Proxy(
    {},
    {
      get() {
        throw new Error("LINKING_ERROR");
      },
    },
  );
