import type { PropsWithChildren } from 'react';

/**
 * Announcement mechanism:
 * - `'pane'`     — layout-changed notification with a title (default)
 * - `'activity'` — screen-change notification (full-screen nav)
 * - `'announce'` — plain announcement, no focus shift
 */
export type A11yPaneType = 'activity' | 'pane' | 'announce';

/** Props for {@link A11y.PaneTitle}. */
export type A11yPaneTitleProps = PropsWithChildren<{
  /** Title announced when this component mounts. */
  title?: string;
  /** Message announced when this component unmounts. */
  detachMessage?: string;
  /** Announcement mechanism. Defaults to `'pane'`. */
  type?: A11yPaneType;
  /** Restore focus to the previously focused element on unmount. Default `true`. */
  withFocusRestore?: boolean;
  /** When `false`, renders nothing and posts no announcement. Default `true`. */
  displayed?: boolean;
}>;

/** Props for {@link A11y.ScreenChange} — `PaneTitle` pre-set to `type="activity"`. */
export type A11yScreenChangeProps = Omit<A11yPaneTitleProps, 'type'>;
