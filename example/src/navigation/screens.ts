import type { ComponentType } from 'react';

import { AnnounceScreen } from '../screens/sr/AnnounceScreen';
import { TrapFrameScreen } from '../screens/sr/TrapFrameScreen';
import { PaneTitleScreen } from '../screens/sr/PaneTitleScreen';
import { CardScreen } from '../screens/sr/CardScreen';
import { UIContainerScreen } from '../screens/sr/UIContainerScreen';
import { KeyboardFocusScreen } from '../screens/keyboard/KeyboardFocusScreen';
import { FocusOrderScreen } from '../screens/keyboard/FocusOrderScreen';
import { FocusLinkOrderScreen } from '../screens/keyboard/FocusLinkOrderScreen';
import { FocusGroupScreen } from '../screens/keyboard/FocusGroupScreen';
import { InputTestScreen } from '../screens/keyboard/InputTestScreen';
import { ProgrammaticFocusScreen } from '../screens/keyboard/ProgrammaticFocusScreen';
import { NativeFocusStyleScreen } from '../screens/keyboard/NativeFocusStyleScreen';
import { FocusEventsScreen } from '../screens/combined/FocusEventsScreen';
import { OptimisticScreen } from '../screens/combined/OptimisticScreen';
import { StatusScreen } from '../screens/combined/StatusScreen';
import { PushScreen } from '../screens/PushScreen';
import {
  FocusOrderTestScreen,
  FocusDPadOrderTestScreen,
  FocusLinkOrderTestScreen,
  FocusMixedOrderTestScreen,
  FocusMixedDpadOrderTestScreen,
  FocusMixedPositionOrderTestScreen,
  FocusOrderRandomizerTestScreen,
  FocusLinkRandomizerTestScreen,
  FocusMixedRandomizerTestScreen,
  FocusMixedPositionRandomizerTestScreen,
} from '../screens/test';
import { LegacyOrderScreen } from '../screens/legacy/LegacyOrderScreen';
import { LegacyDynamicOrderScreen } from '../screens/legacy/LegacyDynamicOrderScreen';
import { LegacyFocusScreen } from '../screens/legacy/LegacyFocusScreen';

export type ScreenGroup = 'Components' | 'Features' | 'API' | 'Test' | 'Legacy';

/** Props every screen may receive from the minimal navigator. */
export type ScreenNavProps = {
  /** Navigate to the next screen in the registry (undefined on the last one). */
  onNext?: () => void;
  /** Navigate to the previous screen in the registry (undefined on the first). */
  onPrev?: () => void;
};

export type ScreenEntry = {
  key: string;
  title: string;
  /** One-line summary shown under the title on the Home list. */
  subtitle?: string;
  group: ScreenGroup;
  Component: ComponentType<ScreenNavProps>;
};

/** Per-group accent color + caption used by the Home list. */
export const GROUP_META: Record<
  ScreenGroup,
  { color: string; caption: string }
> = {
  Components: {
    color: '#4f46e5',
    caption: 'Drop-in accessible components',
  },
  Features: {
    color: '#16a34a',
    caption: 'Focus ordering, grouping & container semantics',
  },
  API: {
    color: '#7c3aed',
    caption: 'Imperative announce & focus calls',
  },
  Test: {
    color: '#0891b2',
    caption: 'Experimental focus-order playgrounds',
  },
  Legacy: {
    color: '#64748b',
    caption: 'Imperative 0.7 API, kept for reference',
  },
};

/** Flat registry, grouped by feature, that drives both the Home list and routing. */
export const SCREENS: ScreenEntry[] = [
  // ─── Components ──────────────────────────────────────────────────────────
  {
    key: 'kbd',
    title: 'Keyboard focus',
    subtitle: 'Focused & pressed state across render modes',
    group: 'Components',
    Component: KeyboardFocusScreen,
  },
  {
    key: 'input-test',
    title: 'TextInput',
    subtitle: 'A11y.Input within the Tab order',
    group: 'Components',
    Component: InputTestScreen,
  },
  {
    key: 'card',
    title: 'Card',
    subtitle: 'Card as one action, inner controls intact',
    group: 'Components',
    Component: CardScreen,
  },
  {
    key: 'trap',
    title: 'Focus trap / frame',
    subtitle: 'Confine SR + keyboard focus to a subtree',
    group: 'Components',
    Component: TrapFrameScreen,
  },
  {
    key: 'pane',
    title: 'Pane title / screen change',
    subtitle: 'Pane & screen-change announcements',
    group: 'Components',
    Component: PaneTitleScreen,
  },
  {
    key: 'focus-events',
    title: 'Focus events',
    subtitle: 'focus / blur from SR and keyboard',
    group: 'Components',
    Component: FocusEventsScreen,
  },
  {
    key: 'programmatic',
    title: 'Programmatic focus',
    subtitle: 'Move focus imperatively with focus()',
    group: 'Components',
    Component: ProgrammaticFocusScreen,
  },

  // ─── Features ────────────────────────────────────────────────────────────
  {
    key: 'optimistic',
    title: 'Optimistic values',
    subtitle: 'Predicted VoiceOver values on action (iOS)',
    group: 'Features',
    Component: OptimisticScreen,
  },
  {
    key: 'group',
    title: 'Focus group',
    subtitle: 'Bind members into one keyboard focus unit',
    group: 'Features',
    Component: FocusGroupScreen,
  },
  {
    key: 'ui-container',
    title: 'UI container',
    subtitle: 'iOS container semantics for VoiceOver',
    group: 'Features',
    Component: UIContainerScreen,
  },
  {
    key: 'kbd-order',
    title: 'Focus order (keyboard/screen reader)',
    subtitle: 'orderIndex drives the Tab sequence',
    group: 'Features',
    Component: FocusOrderScreen,
  },
  {
    key: 'kbd-link-order',
    title: 'Keyboard link order',
    subtitle: 'Chain cells with orderForward / orderBackward',
    group: 'Features',
    Component: FocusLinkOrderScreen,
  },
  {
    key: 'native-focus-style',
    title: 'Native focus style',
    subtitle: 'Native focus halo / highlight per platform',
    group: 'Features',
    Component: NativeFocusStyleScreen,
  },

  // ─── API ─────────────────────────────────────────────────────────────────
  {
    key: 'announce',
    title: 'Announcements',
    subtitle: 'Live announcements — priority, queue & delay',
    group: 'API',
    Component: AnnounceScreen,
  },
  {
    key: 'status',
    title: 'Status',
    subtitle: 'Live screen-reader & keyboard detection',
    group: 'API',
    Component: StatusScreen,
  },
  {
    key: 'push-test',
    title: 'Push test',
    subtitle: 'Recursively push screens; verify state on back',
    group: 'API',
    Component: PushScreen,
  },

  // ─── Test ────────────────────────────────────────────────────────────────
  {
    key: 'focus-order',
    title: 'Focus order',
    subtitle: 'Index order + lockFocus',
    group: 'Test',
    Component: FocusOrderTestScreen,
  },
  {
    key: 'focus-dpad-order',
    title: 'DPad order',
    subtitle: 'Directional arrow-key navigation',
    group: 'Test',
    Component: FocusDPadOrderTestScreen,
  },
  {
    key: 'focus-link-order',
    title: 'Focus link order',
    subtitle: 'Explicit forward / backward links',
    group: 'Test',
    Component: FocusLinkOrderTestScreen,
  },
  {
    key: 'focus-mixed-order',
    title: 'Mixed order',
    subtitle: 'Inputs + pressables in one chain',
    group: 'Test',
    Component: FocusMixedOrderTestScreen,
  },
  {
    key: 'focus-mixed-dpad',
    title: 'Mixed DPad',
    subtitle: 'D-pad across inputs and pressables',
    group: 'Test',
    Component: FocusMixedDpadOrderTestScreen,
  },
  {
    key: 'focus-mixed-position',
    title: 'Mixed position order',
    subtitle: 'Inputs + pressables by orderIndex',
    group: 'Test',
    Component: FocusMixedPositionOrderTestScreen,
  },
  {
    key: 'focus-order-randomizer',
    title: 'Order randomizer',
    subtitle: 'Reassign orderIndex live',
    group: 'Test',
    Component: FocusOrderRandomizerTestScreen,
  },
  {
    key: 'focus-link-randomizer',
    title: 'Link randomizer',
    subtitle: 'Rebuild the link chain live',
    group: 'Test',
    Component: FocusLinkRandomizerTestScreen,
  },
  {
    key: 'focus-mixed-randomizer',
    title: 'Mixed randomizer',
    subtitle: 'Randomize the link chain (mixed)',
    group: 'Test',
    Component: FocusMixedRandomizerTestScreen,
  },
  {
    key: 'focus-mixed-position-randomizer',
    title: 'Mixed position randomizer',
    subtitle: 'Randomize orderIndex (mixed)',
    group: 'Test',
    Component: FocusMixedPositionRandomizerTestScreen,
  },

  // ─── Legacy ──────────────────────────────────────────────────────────────
  {
    key: 'legacy-order',
    title: 'Legacy focus order',
    subtitle: '0.7 imperative reading order',
    group: 'Legacy',
    Component: LegacyOrderScreen,
  },
  {
    key: 'legacy-dynamic-order',
    title: 'Legacy dynamic order',
    subtitle: '0.7 stable slots as rows change',
    group: 'Legacy',
    Component: LegacyDynamicOrderScreen,
  },
  {
    key: 'legacy-focus',
    title: 'Legacy imperative focus',
    subtitle: '0.7 setAccessibilityFocus / setKeyboardFocus',
    group: 'Legacy',
    Component: LegacyFocusScreen,
  },
];

export const GROUPS: ScreenGroup[] = [
  'Components',
  'Features',
  'API',
  'Test',
  'Legacy',
];
