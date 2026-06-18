import { NativeModules, Platform } from 'react-native';
import NativeA11yAnnounceModule from '../../nativeSpecs/NativeA11yAnnounceModule';

const LINKING_ERROR =
  `The package 'react-native-a11y' doesn't seem to be linked. Make sure: \n\n${Platform.select(
    { ios: "- You have run 'pod install'\n", default: '' }
  )}- You rebuilt the app after installing the package\n` +
  `- You are not using Expo Go\n`;

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const A11yAnnounceNative = isTurboModuleEnabled
  ? NativeA11yAnnounceModule
  : NativeModules.A11yAnnounceModule;

const A11yAnnounceProxy: typeof NativeA11yAnnounceModule =
  A11yAnnounceNative ??
  new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnnouncePriority = 'low' | 'default' | 'high';

export type AnnounceStatus = 'spoken' | 'fired' | 'cancelled';

export type AnnounceOptions = {
  /**
   * Controls urgency. iOS 17+: maps to `UIAccessibilityPriority`.
   *
   * - `'low'`     — spoken only when the screen reader is fully idle
   * - `'default'` — standard queued announcement (default)
   * - `'high'`    — may preempt lower-priority pending items
   */
  priority?: AnnouncePriority;

  /**
   * When `true`, waits for current speech before speaking.
   * When `false`, may interrupt current speech.
   * Default: `true`
   */
  queue?: boolean;

  /**
   * Navigation-aware mode. When `true`, the announcement waits for:
   * - Active navigation transitions to finish (1 s lock after screen change)
   * - The screen reader to have a focused element
   * - A 300 ms debounce to prevent overlap with focus changes
   *
   * Promise resolves when the service **actually fires** the announcement
   * (not just when it's enqueued), so `await` is meaningful.
   * Default: `false`
   */
  calm?: boolean;

  /**
   * Explicit delay in milliseconds before the announcement is posted.
   * In `calm` mode the service manages its own timing; this is ignored.
   * Default: `0`
   */
  delayMs?: number;

  /**
   * iOS-only speech characteristics. No-op on Android.
   * Only relevant in direct mode (`calm: false`).
   */
  speech?: {
    /**
     * BCP-47 language tag (e.g. `'fr-FR'`). Defaults to the system language.
     * @platform ios
     */
    language?: string;

    /**
     * Voice pitch multiplier, range `0.0`–`2.0`. Default: `1.0`.
     * @platform ios
     */
    pitch?: number;

    /**
     * Spell each character individually.
     * Useful for codes, CAPTCHAs, or abbreviations.
     * @platform ios
     */
    spellOut?: boolean;

    /**
     * Read punctuation marks aloud (e.g. "comma", "period").
     * @platform ios
     */
    punctuation?: boolean;

    /**
     * IPA pronunciation hint applied to the entire string.
     * @platform ios
     */
    ipaNotation?: string;
  };
};

export type AnnouncementResult = {
  /** UUID assigned at enqueue time. */
  id: string;
  /**
   * - `'spoken'`    — VoiceOver confirmed full speech (iOS direct mode only).
   * - `'fired'`     — posted to the screen reader; completion not confirmed.
   *                   Always the case on Android. iOS calm mode resolves here
   *                   once the service actually fires the announcement.
   * - `'cancelled'` — explicitly cancelled via `cancel()` or `cancelAll()`.
   */
  status: AnnounceStatus;
};

// ─── Core API ─────────────────────────────────────────────────────────────────

/**
 * Posts a screen reader announcement.
 *
 * **calm mode** (`calm: true`): navigation-aware — waits for transitions to
 * settle and for VoiceOver/TalkBack to have a focused element. Promise
 * resolves when the announcement is **actually fired** (not just enqueued).
 *
 * **direct mode** (`calm: false`, default): posts immediately with speech
 * attributes. On iOS, Promise resolves when VoiceOver confirms speech finished
 * (`status: 'spoken'`) or was interrupted (`status: 'fired'`).
 * On Android, always resolves immediately with `status: 'fired'`.
 */
export function announce(
  message: string,
  options?: AnnounceOptions
): Promise<AnnouncementResult> {
  const { speech, ...rest } = options ?? {};
  return A11yAnnounceProxy!.announce(message, {
    ...rest,
    ...speech,
  }) as Promise<AnnouncementResult>;
}

/**
 * Cancels the announcement with the given `id`.
 * In calm mode, removes it from the service queue if not yet fired.
 * In direct mode, interrupts the active announcement if it matches.
 */
export function cancel(id: string): Promise<AnnouncementResult> {
  return A11yAnnounceProxy!.cancel(id) as Promise<AnnouncementResult>;
}

/**
 * Cancels all pending and active announcements.
 * Calm-mode promises resolve with `status: 'cancelled'`.
 */
export function cancelAll(): Promise<AnnouncementResult> {
  return A11yAnnounceProxy!.cancelAll() as Promise<AnnouncementResult>;
}

// ─── Namespace export (backward-compatible) ───────────────────────────────────

export const ScreenReader = {
  /**
   * Posts a navigation-aware announcement (calm mode).
   * Waits for transitions to finish before speaking.
   * Promise resolves when the announcement is actually fired.
   */
  announce: (message: string, options?: AnnounceOptions) =>
    announce(message, { calm: true, ...options }),

  cancel,
  cancelAll,
};
