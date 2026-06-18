import { StyleSheet } from 'react-native';
import Card from '../../nativeSpecs/A11yCardNativeComponent';
import { A11yPressable } from '../A11yPressable';
import type { A11yCardProps } from './A11yCard.types';
import { A11yView } from '../A11yView';

/**
 * iOS: a native card exposes a full-cover overlay that VoiceOver focuses, while the
 * surface is an `A11y.Pressable` that handles touch and keyboard focus (halo +
 * `focusStyle`). The overlay drives VoiceOver; the pressable drives the keyboard.
 */
export const A11yCard = ({
  containerProps,
  style,
  focusStyle,
  testID,
  onPress,
  accessibility,
  pressableProps,
  PressableComponent = A11yPressable,
  children,
}: A11yCardProps) => {
  return (
    <Card {...containerProps} style={[styles.container, containerProps?.style]}>
      <A11yView
        testID={`${testID}-overlay`}
        accessibilityRole="button"
        {...accessibility}
        accessible
        focusable={false}
        pointerEvents="none"
        collapsable={false}
        onAccessibilityTap={onPress}
        style={styles.overlay}
      />
      <PressableComponent
        {...pressableProps}
        accessible={false}
        onPress={onPress}
        testID={testID}
        focusStyle={focusStyle}
        style={style}
      >
        {children}
      </PressableComponent>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
