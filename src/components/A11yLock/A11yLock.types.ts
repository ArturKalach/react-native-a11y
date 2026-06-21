import type { ViewProps } from 'react-native';

/**
 * Props for {@link A11y.FocusTrap} — confines screen-reader **and** keyboard focus
 * to this subtree (modals, sheets, overlays).
 */
export type A11yFocusTrapProps = ViewProps & {
  /** When `true`, the trap is inactive and focus can leave freely. Default `false`. */
  lockDisabled?: boolean;
  /** When `true`, focus is moved inside immediately on mount. Default `false`. */
  forceLock?: boolean;
};

/** Props for {@link A11y.FocusFrame} — detects focus escaping this subtree. */
export type A11yFocusFrameProps = ViewProps;

/** @internal Full props accepted by the native lock component. */
export type A11yLockProps = ViewProps & {
  componentType?: number;
  containerKey?: string;
  lockDisabled?: boolean;
  forceLock?: boolean;
};
