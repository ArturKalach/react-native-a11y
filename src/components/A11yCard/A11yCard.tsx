import { StyleSheet, View } from 'react-native';
import { A11yPressable } from '../A11yPressable';
import type { A11yCardProps } from './A11yCard.types';

/**
 * Android/default: TalkBack does not block child focus, so the card surface is a
 * single `A11y.Pressable` — it carries the a11y props directly and participates in
 * keyboard focus (halo / highlight + `focusStyle`).
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
    <View collapsable={false} {...containerProps}>
      <PressableComponent
        {...pressableProps}
        accessibilityRole="button"
        {...accessibility}
        accessible
        onPress={onPress}
        testID={testID}
        focusStyle={focusStyle}
        style={[style, styles.container]}
      >
        {children}
      </PressableComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative' },
});
