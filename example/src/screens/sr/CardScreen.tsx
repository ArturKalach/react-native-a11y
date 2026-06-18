import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { A11y } from 'react-native-a11y';
import { Card, Screen } from '../../components';

const PRICE = 5.5;
const MAX_LOG = 6;

// Custom keyboard-focus ring shared by the cards and their inner buttons.
// `tintType="none"` turns off the platform halo/highlight so only this shows.
const NO_TINT = { tintType: 'none' } as const;

/**
 * A11y.Card — the "card with inner buttons" pattern, with custom keyboard focus.
 *
 * Each card and its inner controls are backed by A11y.Pressable, so they take
 * keyboard focus and render a custom `focusStyle` ring (Tab with a hardware
 * keyboard to see it). The stepper stays independently accessible to the screen
 * reader; a plain Pressable would swallow the −/+ buttons.
 */
export const CardScreen = () => {
  const [qty, setQty] = useState(1);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) =>
    setLog((prev) => [message, ...prev].slice(0, MAX_LOG));

  return (
    <Screen
      title="Card"
      description="A11y.Card exposes the card as a single focusable action while keeping inner controls (the −/+ stepper) independently accessible. Tab with a keyboard to see the custom focus ring."
    >
      <Card label="A11y.Card">
        <A11y.Card
          pressableProps={NO_TINT}
          focusStyle={styles.focus}
          style={styles.card}
          onPress={() => addLog('Card pressed → open product details')}
          accessibility={{
            accessibilityLabel: 'Matcha Latte, Medium, Oat milk. $5.50',
            accessibilityHint: 'Double tap to view product details',
          }}
        >
          <View style={styles.thumb}>
            <Text style={styles.thumbIcon}>🍵</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.title}>Matcha Latte</Text>
            <Text style={styles.subtitle}>Medium · Oat milk</Text>
          </View>

          <View style={styles.right}>
            <View style={styles.stepper}>
              <A11y.Pressable
                {...NO_TINT}
                focusStyle={styles.focus}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
                disabled={qty <= 1}
                focusable={qty > 1}
                onPress={() =>
                  setQty((q) => {
                    const next = Math.max(1, q - 1);
                    addLog(`Decrease → quantity ${next}`);
                    return next;
                  })
                }
                style={[styles.stepBtn, qty <= 1 && styles.stepBtnDisabled]}
              >
                <Text style={styles.stepLabel}>−</Text>
              </A11y.Pressable>

              <Text style={styles.qty} accessibilityLabel={`Quantity ${qty}`}>
                {qty}
              </Text>

              <A11y.Pressable
                {...NO_TINT}
                focusStyle={styles.focus}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
                onPress={() =>
                  setQty((q) => {
                    const next = q + 1;
                    addLog(`Increase → quantity ${next}`);
                    return next;
                  })
                }
                style={styles.stepBtn}
              >
                <Text style={styles.stepLabel}>+</Text>
              </A11y.Pressable>
            </View>

            <Text style={styles.price}>${(PRICE * qty).toFixed(2)}</Text>
          </View>
        </A11y.Card>
      </Card>

      <Card label="Nested A11y.Card">
        <A11y.Card
          pressableProps={NO_TINT}
          focusStyle={styles.focus}
          style={styles.outer}
          onPress={() => addLog('Outer card pressed → open order')}
          accessibility={{
            accessibilityLabel: 'Your order, 1 item, $5.50',
            accessibilityHint: 'Double tap to review the order',
          }}
        >
          <Text style={styles.title}>Your order</Text>
          <Text style={styles.subtitle}>1 item · $5.50</Text>

          {/* Multiple nested actions inside the outer card. Each inner card and
              button must stay an independent screen-reader element so focus
              order is: outer card → promo → gift → edit → remove. */}
          <A11y.Card
            pressableProps={NO_TINT}
            focusStyle={styles.focus}
            style={styles.inner}
            onPress={() => addLog('Inner card pressed → apply promo')}
            accessibility={{
              accessibilityLabel: 'Apply promo code FREESHIP',
              accessibilityHint: 'Double tap to apply the discount',
            }}
          >
            <Text style={styles.promoIcon}>🎟️</Text>
            <View style={styles.info}>
              <Text style={styles.promoTitle}>Apply promo</Text>
              <Text style={styles.subtitle}>FREESHIP — free delivery</Text>
            </View>
            <A11y.Pressable
              {...NO_TINT}
              focusStyle={styles.focus}
              accessibilityRole="button"
              accessibilityLabel="Remove promo code"
              onPress={() => addLog('Promo: remove pressed')}
              style={styles.chip}
            >
              <Text style={styles.chipLabel}>Remove</Text>
            </A11y.Pressable>
          </A11y.Card>

          <A11y.Card
            pressableProps={NO_TINT}
            focusStyle={styles.focus}
            style={styles.inner}
            onPress={() => addLog('Inner card pressed → add gift wrap')}
            accessibility={{
              accessibilityLabel: 'Add gift wrap, $2.00',
              accessibilityHint: 'Double tap to add gift wrapping',
            }}
          >
            <Text style={styles.promoIcon}>🎁</Text>
            <View style={styles.info}>
              <Text style={styles.promoTitle}>Add gift wrap</Text>
              <Text style={styles.subtitle}>+$2.00</Text>
            </View>
            <A11y.Pressable
              {...NO_TINT}
              focusStyle={styles.focus}
              accessibilityRole="button"
              accessibilityLabel="Choose gift wrap color"
              onPress={() => addLog('Gift wrap: choose color pressed')}
              style={styles.chip}
            >
              <Text style={styles.chipLabel}>Color</Text>
            </A11y.Pressable>
          </A11y.Card>

          <View style={styles.actions}>
            <A11y.Pressable
              {...NO_TINT}
              focusStyle={styles.focusEdit}
              containerStyle={styles.actionBtnContainer}
              accessibilityRole="button"
              accessibilityLabel="Edit order"
              onPress={() => addLog('Edit button pressed')}
              style={[styles.actionBtn, styles.editBtn]}
            >
              <Text style={styles.editLabel}>Edit</Text>
            </A11y.Pressable>
            <A11y.Pressable
              {...NO_TINT}
              focusStyle={styles.focusRemove}
              containerStyle={styles.actionBtnContainer}
              accessibilityRole="button"
              accessibilityLabel="Remove order"
              onPress={() => addLog('Remove button pressed')}
              style={[styles.actionBtn, styles.removeBtn]}
            >
              <Text style={styles.removeLabel}>Remove</Text>
            </A11y.Pressable>
          </View>
        </A11y.Card>
      </Card>

      <Card label="Event log">
        <View style={styles.log}>
          {log.length === 0 ? (
            <Text style={styles.logEmpty}>
              Tap the card or the −/+ buttons…
            </Text>
          ) : (
            log.map((entry, i) => (
              <Text key={`${entry}-${i}`} style={styles.logLine}>
                {entry}
              </Text>
            ))
          )}
        </View>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  // Custom keyboard-focus ring (shown on Tab; touch/SR focus don't trigger it).
  focus: { borderColor: '#16a34a', borderWidth: 2 },
  // Component-specific focus rings that match each action's semantic color.
  focusEdit: { borderColor: '#334155', borderWidth: 2 },
  focusRemove: { borderColor: '#dc2626', borderWidth: 2 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#e7f6e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbIcon: { fontSize: 24 },
  info: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#94a3b8' },
  right: { alignItems: 'flex-end', gap: 8 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 3,
    borderRadius: 11,
    backgroundColor: '#f1f5f9',
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: { opacity: 0.4 },
  stepLabel: { fontSize: 20, lineHeight: 22, color: '#334155' },
  qty: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
    color: '#1e293b',
  },
  price: { fontSize: 14, fontWeight: '700', color: '#16a34a' },
  outer: {
    gap: 6,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  promoIcon: { fontSize: 22 },
  promoTitle: { fontSize: 14, fontWeight: '700', color: '#92400e' },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  chipLabel: { fontSize: 13, fontWeight: '600', color: '#92400e' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  // flex lives on the focus-host wrapper (containerStyle); the inner Pressable
  // stretches to fill it. Putting flex on the button style alone collapses the
  // wrapper to content width.
  actionBtnContainer: { flex: 1 },
  actionBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  editBtn: { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
  editLabel: { fontSize: 14, fontWeight: '600', color: '#334155' },
  removeBtn: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  removeLabel: { fontSize: 14, fontWeight: '600', color: '#dc2626' },
  log: { gap: 4, minHeight: 24 },
  logEmpty: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic' },
  logLine: { fontSize: 13, color: '#334155', fontFamily: 'monospace' },
});
