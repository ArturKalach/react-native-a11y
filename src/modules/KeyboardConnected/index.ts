import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import NativeA11yKeyboardConnectedModule from '../../nativeSpecs/NativeRCA11yKeyboardConnectedModule';

const KEYBOARD_STATUS_EVENT = 'keyboardStatus';

const LINKING_ERROR =
  `The package 'react-native-a11y' doesn't seem to be linked. Make sure: \n\n${Platform.select(
    { ios: "- You have run 'pod install'\n", default: '' }
  )}- You rebuilt the app after installing the package\n` +
  `- You are not using Expo Go\n`;

// @ts-expect-error — global proxy flag is untyped
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const KeyboardConnectedNative = isTurboModuleEnabled
  ? NativeA11yKeyboardConnectedModule
  : NativeModules.RCA11yKeyboardConnectedModule;

const KeyboardConnected: NonNullable<typeof NativeA11yKeyboardConnectedModule> =
  KeyboardConnectedNative ??
  new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

/** Status-change callback payload, mirroring `react-native-is-keyboard-connected`. */
export type StatusCallback = (e: { status: boolean }) => void;

/** Resolves whether a physical keyboard is currently connected. */
export const isKeyboardConnected = (): Promise<boolean> =>
  KeyboardConnected.isKeyboardConnected();

/**
 * Subscribes to physical-keyboard connect/disconnect events.
 * Returns a function that removes the listener.
 */
export const keyboardStatusListener = (callback: StatusCallback) => {
  const eventEmitter = new NativeEventEmitter(
    KeyboardConnected as unknown as ConstructorParameters<
      typeof NativeEventEmitter
    >[0]
  );
  const subscription = eventEmitter.addListener(
    KEYBOARD_STATUS_EVENT,
    callback
  );
  return () => subscription.remove();
};
