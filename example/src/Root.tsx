import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { A11yProvider } from 'react-native-a11y';

import { HomeScreen } from './screens/HomeScreen';
import { SCREENS, type ScreenEntry } from './navigation/screens';

/**
 * Minimal dependency-free stack navigator: a feature-grouped Home list pushes to
 * a screen, with a Back control to pop and a Prev/Next footer to walk the
 * registry. Wrapped in A11yProvider so the status hooks work app-wide.
 */
export const Root = () => {
  const [active, setActive] = useState<ScreenEntry | null>(null);

  const activeIndex = active
    ? SCREENS.findIndex((s) => s.key === active.key)
    : -1;
  const prevEntry = activeIndex > 0 ? SCREENS[activeIndex - 1] ?? null : null;
  const nextEntry = activeIndex >= 0 ? SCREENS[activeIndex + 1] ?? null : null;

  const goPrev = prevEntry ? () => setActive(prevEntry) : undefined;
  const goNext = nextEntry ? () => setActive(nextEntry) : undefined;

  return (
    <A11yProvider>
      <SafeAreaView style={styles.root}>
        {active ? (
          <View style={styles.screen}>
            <Pressable
              style={styles.back}
              onPress={() => setActive(null)}
              accessibilityRole="button"
              accessibilityLabel="Back to home"
            >
              <Text style={styles.backText}>‹ Home</Text>
            </Pressable>

            <View style={styles.body}>
              <active.Component onNext={goNext} onPrev={goPrev} />
            </View>

            <View style={styles.navBar}>
              <NavButton label="‹ Prev" target={prevEntry} onPress={goPrev} />
              <Text style={styles.navTitle} numberOfLines={1}>
                {active.title}
              </Text>
              <NavButton
                label="Next ›"
                target={nextEntry}
                onPress={goNext}
                alignEnd
              />
            </View>
          </View>
        ) : (
          <HomeScreen onSelect={setActive} />
        )}
      </SafeAreaView>
    </A11yProvider>
  );
};

type NavButtonProps = {
  label: string;
  target: ScreenEntry | null;
  onPress?: () => void;
  alignEnd?: boolean;
};

const NavButton = ({ label, target, onPress, alignEnd }: NavButtonProps) => {
  const disabled = !target;
  return (
    <Pressable
      style={[styles.navBtn, alignEnd ? styles.navBtnEnd : styles.navBtnStart]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={
        target
          ? `${label.replace(/[‹›]/g, '').trim()}: ${target.title}`
          : undefined
      }
    >
      <Text style={[styles.navText, disabled && styles.navTextDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  screen: { flex: 1 },
  body: { flex: 1 },
  back: { paddingHorizontal: 16, paddingVertical: 10 },
  backText: { fontSize: 17, color: '#2b6cb0', fontWeight: '600' },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  navBtn: { flex: 1, justifyContent: 'center', minHeight: 24 },
  navBtnStart: { alignItems: 'flex-start' },
  navBtnEnd: { alignItems: 'flex-end' },
  navText: { fontSize: 16, color: '#2b6cb0', fontWeight: '600' },
  navTextDisabled: { color: '#c3c3c3' },
  navTitle: {
    flex: 2,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
});
