import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/** Keyboard imperative module backing `Keyboard` (was `ExternalKeyboardModule`). */
export interface Spec extends TurboModule {
  dismissKeyboard: () => Promise<boolean>;
  /** Move physical-keyboard focus to the view (and force a focus update). */
  setKeyboardFocus: (nativeTag: number) => void;
  /** Mark the view as the preferred keyboard-focus target (no forced update). */
  setPreferredKeyboardFocus: (nativeTag: number) => void;
}

export default TurboModuleRegistry.get<Spec>('RCA11yKeyboardModule');
