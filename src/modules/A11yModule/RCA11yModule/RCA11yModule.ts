import { NativeModules, Platform } from "react-native";

const LINKING_ERROR =
  `The package 'react-native-a11y' doesn't seem to be linked. Make sure: \n\n${Platform.select(
    { ios: "- You have run 'pod install'\n", default: "" },
  )}- You rebuilt the app after installing the package\n` +
  `- You are not using Expo Go\n`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const RCA11yModule = isTurboModuleEnabled
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../../../nativeSpecs/NativeA11yModule").default
  : NativeModules.RCA11yModule;

export const RCA11y =
  RCA11yModule ||
  new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    },
  );

export function isA11yReaderEnabled(): Promise<boolean> {
  return RCA11y.isA11yReaderEnabled();
}

export function isKeyboardConnected(): Promise<boolean> {
  return RCA11y.isKeyboardConnected();
}

export function announceForAccessibility(announcement: string): void {
  RCA11y.announceForAccessibility(announcement);
}

export function announceScreenChange(announcement: string): void {
  RCA11y.announceScreenChange(announcement);
}

export function setAccessibilityFocus(nativeTag: number): void {
  RCA11y.setAccessibilityFocus(nativeTag);
}

export function setKeyboardFocus(nativeTag: number, _nextTag?: number): void {
  RCA11y.setKeyboardFocus(nativeTag, 0);
}

export function setPreferredKeyboardFocus(
  nativeTag: number,
  nextTag: number,
): void {
  RCA11y.setAccessibilityFocus(nativeTag, nextTag);
}

export function setA11yOrder(tags: number[], nativeTag?: number): void {
  RCA11y.setA11yOrder(tags, nativeTag);
}
