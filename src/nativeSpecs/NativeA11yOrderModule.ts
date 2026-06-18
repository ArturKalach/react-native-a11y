import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Imperative screen-reader order module backing the legacy `Legacy.useFocusOrder`
 * / `Legacy.useDynamicFocusOrder` hooks. Reorders accessibility traversal for a
 * set of already-rendered views (the 0.7 `setA11yElementsOrder` behavior).
 *
 * - `viewTags` — native tags (`findNodeHandle`) of the ordered child views.
 * - `containerTag` — native tag of the wrapping container (or `-1` when absent).
 *   On iOS its `accessibilityElements` is set and a screen-changed notification
 *   is posted; on Android only the view chain is linked.
 */
export interface Spec extends TurboModule {
  setA11yOrder: (viewTags: number[], containerTag: number) => void;
}

export default TurboModuleRegistry.get<Spec>('A11yOrderModule');
