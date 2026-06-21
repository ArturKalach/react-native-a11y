import type { ComponentType, ReactNode } from 'react';
import type { ViewStyle, StyleProp, ViewProps } from 'react-native';
import type { FocusStyle } from '../../types';
import type { A11yPressableProps } from '../A11yPressable';

/** Accessibility props forwarded to the focusable overlay (iOS) or Pressable (Android). */
export type A11yCardAccessibilityProps = ViewProps;

export interface A11yCardProps {
  /** Props applied to the container View wrapping the card (layout concerns). */
  containerProps?: ViewProps;
  /** Style for the card surface (the inner `A11y.Pressable`). */
  style?: StyleProp<ViewStyle>;
  /** Style merged onto the card surface while it holds keyboard focus. */
  focusStyle?: FocusStyle;
  /** Locates this view in end-to-end tests. */
  testID?: string;
  /** Called when the user taps the card. */
  onPress?: () => void;
  /**
   * Accessibility props for the card action. On iOS forwarded to a full-cover
   * overlay that VoiceOver focuses; on Android applied to the Pressable.
   */
  accessibility?: A11yCardAccessibilityProps;
  /**
   * Extra props for the keyboard-focusable `A11y.Pressable` backing the card —
   * e.g. `containerStyle` / `containerFocusStyle`, `renderContent` /
   * `renderFocusable`, `tintColor` / `tintType`, `onFocusChange`, `focusable`,
   * and the `halo*` / `order*` keyboard-focus props.
   */
  pressableProps?: Omit<
    A11yPressableProps,
    'children' | 'style' | 'onPress' | 'focusStyle' | 'ref'
  >;
  /**
   * Component used for the card surface. Defaults to `A11y.Pressable` (keyboard
   * focus + `focusStyle`). Pass any Pressable-like component (e.g. RN `Pressable`,
   * `TouchableOpacity`) to opt out; it receives `style`, `onPress`, `testID`,
   * and `pressableProps`. Focus-only props (`focusStyle`, halo/order) only apply
   * to the default `A11y.Pressable`.
   */
  PressableComponent?: ComponentType<any>;
  children?: ReactNode;
}
