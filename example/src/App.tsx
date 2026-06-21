import { A11yProvider } from 'react-native-a11y';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  useNavigation,
  type ParamListBase,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HomeScreen } from './screens/HomeScreen';
import { SCREENS, type ScreenEntry } from './navigation/screens';
import { PushModeProvider, usePushMode } from './navigation/pushMode';

const Stack = createNativeStackNavigator();
const HOME = 'Home';

type Nav = NativeStackNavigationProp<ParamListBase>;

/**
 * Sticky footer that walks the registry order. When recursive push mode is on
 * (toggled from the Push test screen), a center Push button is inserted between
 * Prev and Next so any screen can stack another at depth.
 */
const NavFooter = ({
  prev,
  next,
  onPrev,
  onNext,
  onPush,
}: {
  prev: ScreenEntry | null;
  next: ScreenEntry | null;
  onPrev?: () => void;
  onNext?: () => void;
  onPush: () => void;
}) => {
  const { enabled } = usePushMode();
  return (
    <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerBtn, styles.footerStart]}
          onPress={onPrev}
          disabled={!prev}
          accessibilityRole="button"
          accessibilityState={{ disabled: !prev }}
          accessibilityLabel={prev ? `Previous: ${prev.title}` : undefined}
        >
          <Text style={[styles.footerText, !prev && styles.footerTextDisabled]}>
            ‹ Prev
          </Text>
        </TouchableOpacity>

        {enabled && (
          <TouchableOpacity
            style={styles.pushBtn}
            onPress={onPush}
            accessibilityRole="button"
            accessibilityLabel="Push a random screen"
          >
            <Text style={styles.pushBtnText}>Push ⤳</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.footerBtn, styles.footerEnd]}
          onPress={onNext}
          disabled={!next}
          accessibilityRole="button"
          accessibilityState={{ disabled: !next }}
          accessibilityLabel={next ? `Next: ${next.title}` : undefined}
        >
          <Text style={[styles.footerText, !next && styles.footerTextDisabled]}>
            Next ›
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/** Pushes a fresh instance of a random registry route (excluding Home). */
const pushRandomScreen = (navigation: Nav) => {
  const names = navigation
    .getState()
    .routeNames.filter((name) => name !== HOME);
  const name = names[Math.floor(Math.random() * names.length)];
  if (name) navigation.push(name);
};

/**
 * Wraps a screen with a registry-walking Prev/Next footer and still passes the
 * `onPrev` / `onNext` props (preserved from the old custom navigator) — now
 * backed by react-navigation. Built once per entry since SCREENS is static.
 */
const withNavProps = (entry: ScreenEntry) => {
  const Comp = entry.Component;
  const index = SCREENS.findIndex((s) => s.key === entry.key);
  const prev = SCREENS[index - 1] ?? null;
  const next = SCREENS[index + 1] ?? null;

  const Wrapped = () => {
    const navigation = useNavigation<Nav>();
    const goPrev = prev ? () => navigation.navigate(prev.key) : undefined;
    const goNext = next ? () => navigation.navigate(next.key) : undefined;
    return (
      <View style={styles.flex}>
        <View style={styles.flex}>
          <Comp onPrev={goPrev} onNext={goNext} />
        </View>
        <NavFooter
          prev={prev}
          next={next}
          onPrev={goPrev}
          onNext={goNext}
          onPush={() => pushRandomScreen(navigation)}
        />
      </View>
    );
  };
  Wrapped.displayName = `Screen_${entry.key}`;
  return Wrapped;
};

const ROUTES = SCREENS.map((entry) => ({
  key: entry.key,
  title: entry.title,
  Component: withNavProps(entry),
}));

/** Home route — the card list pushes to a screen by route key. */
const HomeRoute = () => {
  const navigation = useNavigation<Nav>();
  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <HomeScreen onSelect={(entry) => navigation.navigate(entry.key)} />
    </SafeAreaView>
  );
};

export const App = () => (
  <SafeAreaProvider>
    <A11yProvider>
      <PushModeProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={HOME}
            screenOptions={{
              headerTintColor: '#1e293b',
              headerStyle: { backgroundColor: '#ffffff' },
              headerTitleStyle: { color: '#0f172a' },
            }}
          >
            <Stack.Screen
              name={HOME}
              component={HomeRoute}
              options={{ headerShown: false }}
            />
            {ROUTES.map((r) => (
              <Stack.Screen
                key={r.key}
                name={r.key}
                component={r.Component}
                options={{ title: r.title }}
              />
            ))}
          </Stack.Navigator>
        </NavigationContainer>
      </PushModeProvider>
    </A11yProvider>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  footerSafe: { backgroundColor: '#ffffff' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
  },
  footerBtn: { flex: 1, minHeight: 24, justifyContent: 'center' },
  footerStart: { alignItems: 'flex-start' },
  footerEnd: { alignItems: 'flex-end' },
  footerText: { fontSize: 16, fontWeight: '600', color: '#2563eb' },
  footerTextDisabled: { color: '#cbd5e1' },
  pushBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#7c3aed',
  },
  pushBtnText: { fontSize: 14, fontWeight: '700', color: '#ffffff' },
});

export default App;
