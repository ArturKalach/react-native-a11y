import type { NativeSyntheticEvent } from 'react-native';
import type {
  BaseKeyboardViewProps,
  OrderType,
  ScreenReaderFocusTarget,
} from '../../types';
import type { ScreenReaderDescendantFocusChanged } from '../../nativeSpecs/RCA11yViewNativeComponent';

/** iOS `UIAccessibilityContainerType` for `A11y.View` / `A11y.Index`. */
export type A11yUIContainerType =
  | 'none'
  | 'table'
  | 'list'
  | 'landmark'
  | 'group';

export const A11yContainerTypeEnum: Record<A11yUIContainerType, number> = {
  none: 0,
  table: 1,
  list: 2,
  landmark: 3,
  group: 4,
};

export const ORDER_TYPE_VALUE: Record<OrderType, number> = {
  'auto': 0,
  'keyboard': 1,
  'screen-reader': 2,
};

/** Native descendant-focus event payload. */
export type ScreenReaderDescendantFocusChangedEvent =
  NativeSyntheticEvent<ScreenReaderDescendantFocusChanged>;

/** Screen-reader callbacks accepted by `A11y.View`. */
export type ScreenReaderCallbacks = {
  /** Fires when the screen reader focuses this element directly. */
  onScreenReaderFocused?: () => void;
  /** Fires when SR focus enters/leaves any descendant. */
  onScreenReaderSubViewFocusChange?: (isFocused: boolean) => void;
  /** Fires when SR focus enters a descendant. */
  onScreenReaderSubViewFocused?: () => void;
  /** Fires when SR focus leaves a descendant. */
  onScreenReaderSubViewBlurred?: () => void;
  /** Full native event when SR focus changes on a descendant (carries `nativeId`). */
  onScreenReaderDescendantFocusChanged?: (
    e: ScreenReaderDescendantFocusChangedEvent
  ) => void;
};

/**
 * Props for the unified `A11y.View` (and `A11y.Index`, via the order context).
 * Union of the keyboard focus view props and the screen-reader props; every
 * capability is opt-in.
 */
export type A11yViewProps = BaseKeyboardViewProps &
  ScreenReaderCallbacks & {
    /**
     * Which ordering engine applies: `'auto'` (both), `'keyboard'`, or
     * `'screen-reader'`. Defaults to `'auto'`.
     */
    orderType?: OrderType;
    /**
     * Which element the screen reader treats as this view's focus / traversal
     * node: `'self'` (default), `'firstAccessible'` (first accessible descendant,
     * deep), or `'child'` (first direct child, shallow). Keyboard focus
     * targeting is controlled separately by `focusableWrapper`.
     */
    screenReaderFocusTarget?: ScreenReaderFocusTarget;
    /**
     * Positional index within an enclosing `A11y.Order` (screen-reader order).
     * Alias of `orderIndex`; throws if used outside `A11y.Order`.
     */
    index?: number;
    /** iOS `UIAccessibilityContainerType`. @platform ios */
    a11yUIContainer?: A11yUIContainerType;
    /** iOS `shouldGroupAccessibilityChildren`. @platform ios */
    shouldGroupAccessibilityChildren?: boolean;
  };
