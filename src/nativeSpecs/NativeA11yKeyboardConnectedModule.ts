import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Physical-keyboard connection status (ported from
 * `react-native-is-keyboard-connected`). Emits the `keyboardStatus` event with
 * `{ status: boolean }` on connect/disconnect.
 */
export interface Spec extends TurboModule {
  isKeyboardConnected: () => Promise<boolean>;

  // RCTEventEmitter contract
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.get<Spec>('A11yKeyboardConnectedModule');
