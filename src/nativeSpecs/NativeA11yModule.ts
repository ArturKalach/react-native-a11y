import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  isA11yReaderEnabled: () => Promise<boolean>;
  isKeyboardConnected: () => Promise<boolean>;
  announceForAccessibility: (announcement: string) => void;
  announceScreenChange: (announcement: string) => void;
  setAccessibilityFocus: (nativeTag: number) => void;
  setKeyboardFocus: (nativeTag: number) => void;
  setPreferredKeyboardFocus: (nativeTag: number) => void;
  setA11yOrder: (tags: number[], nativeTag?: number) => void;
}

export default TurboModuleRegistry.get<Spec>('RCA11yModule');
