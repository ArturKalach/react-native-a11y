import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { FocusOrder } from './FocusOrder';
import { FocusDPadOrder } from './FocusDPadOrder';
import { FocusLinkOrder } from './FocusLinkOrder';
import { FocusMixedOrder } from './FocusMixedOrder';
import { FocusMixedDpadOrder } from './FocusMixedDpadOrder';
import { FocusMixedPositionOrder } from './FocusMixedPositionOrder';
import { FocusOrderRandomizer } from './FocusOrderRandomizer';
import { FocusLinkRandomizer } from './FocusLinkRandomizer';
import { FocusMixedRandomizer } from './FocusMixedRandomizer';
import { FocusMixedPositionRandomizer } from './FocusMixedPositionRandomizer';

/**
 * Focus-order playground screens ported from react-native-external-keyboard.
 * Each example is a self-contained keyboard focus-order context (so the Tab /
 * arrow sequence stays clean per screen). Drive them with a hardware keyboard.
 */
const ExampleScroll = ({ children }: { children: ReactNode }) => (
  <ScrollView style={styles.root} contentContainerStyle={styles.content}>
    {children}
  </ScrollView>
);

export const FocusOrderTestScreen = () => (
  <ExampleScroll>
    <FocusOrder />
  </ExampleScroll>
);
export const FocusDPadOrderTestScreen = () => (
  <ExampleScroll>
    <FocusDPadOrder />
  </ExampleScroll>
);
export const FocusLinkOrderTestScreen = () => (
  <ExampleScroll>
    <FocusLinkOrder />
  </ExampleScroll>
);
export const FocusMixedOrderTestScreen = () => (
  <ExampleScroll>
    <FocusMixedOrder />
  </ExampleScroll>
);
export const FocusMixedDpadOrderTestScreen = () => (
  <ExampleScroll>
    <FocusMixedDpadOrder />
  </ExampleScroll>
);
export const FocusMixedPositionOrderTestScreen = () => (
  <ExampleScroll>
    <FocusMixedPositionOrder />
  </ExampleScroll>
);
export const FocusOrderRandomizerTestScreen = () => (
  <ExampleScroll>
    <FocusOrderRandomizer />
  </ExampleScroll>
);
export const FocusLinkRandomizerTestScreen = () => (
  <ExampleScroll>
    <FocusLinkRandomizer />
  </ExampleScroll>
);
export const FocusMixedRandomizerTestScreen = () => (
  <ExampleScroll>
    <FocusMixedRandomizer />
  </ExampleScroll>
);
export const FocusMixedPositionRandomizerTestScreen = () => (
  <ExampleScroll>
    <FocusMixedPositionRandomizer />
  </ExampleScroll>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingVertical: 16, paddingBottom: 32 },
});
