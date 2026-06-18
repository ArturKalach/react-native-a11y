import { useRef } from 'react';
import {
  findNodeHandle,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Legacy } from 'react-native-a11y';
import { Card, Screen } from '../../components';

/**
 * Legacy 0.7 imperative focus helpers (tag-based). Resolve a `nativeTag` with
 * `findNodeHandle(ref.current)` and call the matching `Legacy.*` method.
 */
export const LegacyFocusScreen = () => {
  const srRef = useRef<View>(null);
  const kbRef = useRef<View>(null);

  const withTag = (ref: { current: unknown }, fn: (tag: number) => void) => {
    const tag = findNodeHandle(ref.current as never);
    if (tag) {
      fn(tag);
    }
  };

  return (
    <Screen
      title="Legacy imperative focus"
      description="setAccessibilityFocus moves the screen reader; setKeyboardFocus / setPreferredKeyboardFocus move physical-keyboard focus (preferred is iOS-only)."
    >
      <Card label="Legacy.setAccessibilityFocus">
        <View ref={srRef} accessible style={styles.target}>
          <Text style={styles.targetText}>Screen-reader target</Text>
        </View>
        <Pressable
          style={styles.btn}
          onPress={() => withTag(srRef, Legacy.setAccessibilityFocus)}
        >
          <Text style={styles.btnText}>Move VoiceOver / TalkBack here</Text>
        </Pressable>
      </Card>

      <Card label="Legacy.setKeyboardFocus / setPreferredKeyboardFocus">
        <Pressable
          ref={kbRef}
          focusable
          accessibilityRole="button"
          style={styles.target}
        >
          <Text style={styles.targetText}>Keyboard target</Text>
        </Pressable>
        <Pressable
          style={styles.btn}
          onPress={() => withTag(kbRef, Legacy.setKeyboardFocus)}
        >
          <Text style={styles.btnText}>Move keyboard focus here</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnAlt]}
          onPress={() => withTag(kbRef, Legacy.setPreferredKeyboardFocus)}
        >
          <Text style={styles.btnText}>Set as preferred (iOS)</Text>
        </Pressable>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  target: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#eef',
    borderRadius: 8,
  },
  targetText: { fontSize: 16, color: '#111' },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#2b6cb0',
    alignItems: 'center',
  },
  btnAlt: { backgroundColor: '#4a5568' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
