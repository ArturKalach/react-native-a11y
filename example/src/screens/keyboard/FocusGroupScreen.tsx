import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { A11y } from 'react-native-a11y';
import { Screen } from '../../components';

const isIOS = Platform.OS === 'ios';

type Swatch = {
  background: string;
  color: string;
  colorTag: string;
  contrast: string;
};

const COLORS: Swatch[] = [
  {
    background: '#000000',
    color: '#E5C804',
    colorTag: 'Yellow',
    contrast: '12.59:1',
  },
  {
    background: '#5e9753',
    color: '#ffffff',
    colorTag: 'White',
    contrast: '3.48:1',
  },
  {
    background: '#8034ec',
    color: '#ffffff',
    colorTag: 'White',
    contrast: '5.8:1',
  },
  {
    background: '#59152c',
    color: '#ffffff',
    colorTag: 'White',
    contrast: '13.38:1',
  },
  {
    background: '#71b4a3',
    color: '#000000',
    colorTag: 'Black',
    contrast: '8.75:1',
  },
  {
    background: '#00bf7d',
    color: '#000000',
    colorTag: 'Black',
    contrast: '8.75:1',
  },
  {
    background: '#00b4c5',
    color: '#000000',
    colorTag: 'Black',
    contrast: '8.33:1',
  },
  {
    background: '#c44601',
    color: '#ffffff',
    colorTag: 'White',
    contrast: '4.97:1',
  },
  {
    background: '#b51963',
    color: '#ffffff',
    colorTag: 'White',
    contrast: '6.39:1',
  },
  {
    background: '#89ce00',
    color: '#000000',
    colorTag: 'Black',
    contrast: '10.89:1',
  },
];

const RADII = [5, 15, 30];

/** Big preview of the focused/selected swatch. */
const ColorPreview = ({
  swatch,
  radius,
}: {
  swatch: Swatch;
  radius: number;
}) => (
  <View
    style={[
      styles.preview,
      { backgroundColor: swatch.background, borderRadius: radius },
    ]}
  >
    <Text style={[styles.previewHex, { color: swatch.color }]}>
      {swatch.background}
    </Text>
    <View style={styles.previewDivider} />
    <Text style={[styles.previewCaption, { color: swatch.color }]}>
      Contrast
    </Text>
    <View style={styles.previewRow}>
      <Text style={{ color: swatch.color }}>{swatch.colorTag} text</Text>
      <Text style={[styles.bold, { color: swatch.color }]}>
        {swatch.contrast}
      </Text>
    </View>
  </View>
);

/**
 * A11y.FocusGroup keeps hardware-keyboard focus moving as a unit (iOS focus group)
 * and tints/highlights its members. Two groups here: the color grid drives a live
 * preview as you Tab through it, and a separate options group sets the corner radius.
 */
export const FocusGroupScreen = () => {
  const [current, setCurrent] = useState<Swatch>(COLORS[0]!);
  const [radius, setRadius] = useState(15);

  return (
    <Screen
      title="Focus group"
      description="A11y.FocusGroup binds its members into one keyboard focus unit. Tab into the color grid and move across it — the preview follows focus — then Tab to the options group to change the corner radius."
    >
      <ColorPreview swatch={current} radius={radius} />

      <Text style={styles.sectionLabel}>COLORS</Text>
      <A11y.FocusGroup groupIdentifier="colors" style={styles.grid}>
        {COLORS.map((c) => (
          <A11y.Pressable
            key={`${c.background}_${c.color}`}
            tintColor={c.background}
            defaultFocusHighlightEnabled={false}
            haloExpendX={5}
            haloExpendY={5}
            haloCornerRadius={radius}
            onFocus={() => setCurrent(c)}
            onPress={() => setCurrent(c)}
            accessibilityRole="button"
            accessibilityLabel={`${c.background}, ${c.colorTag} text, contrast ${c.contrast}`}
            containerStyle={[
              styles.swatch,
              { backgroundColor: c.background, borderRadius: radius },
            ]}
          >
            <View style={styles.swatchInner}>
              <Text style={[styles.swatchText, { color: c.color }]}>
                {c.colorTag}
              </Text>
            </View>
          </A11y.Pressable>
        ))}
      </A11y.FocusGroup>

      <Text style={styles.sectionLabel}>CORNER RADIUS</Text>
      <View style={styles.optionWrap}>
        <A11y.FocusGroup
          groupIdentifier="radius"
          style={styles.optionGroup}
          focusStyle={styles.optionGroupFocus}
        >
          {RADII.map((r) => {
            const active = r === radius;
            return (
              <A11y.Pressable
                key={r}
                defaultFocusHighlightEnabled={false}
                focusStyle={isIOS ? undefined : styles.androidOption}
                haloExpendX={5}
                haloExpendY={5}
                haloCornerRadius={15}
                onFocus={() => setRadius(r)}
                onPress={() => setRadius(r)}
                accessibilityRole="button"
                accessibilityLabel={`Corner radius ${r}`}
                style={[
                  styles.optionButton,
                  active && styles.optionButtonActive,
                ]}
              >
                <Text
                  style={[styles.optionText, active && styles.optionTextActive]}
                >
                  {r}
                </Text>
              </A11y.Pressable>
            );
          })}
        </A11y.FocusGroup>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginTop: 8,
    marginLeft: 2,
  },

  preview: { padding: 16 },
  previewHex: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    paddingVertical: 8,
  },
  previewDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
  },
  previewCaption: { textAlign: 'center', fontSize: 11, marginBottom: 6 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bold: { fontWeight: '700' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatch: { width: 72, height: 72 },
  swatchInner: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  swatchText: { textAlign: 'center', fontSize: 12, fontWeight: '600' },

  optionWrap: { alignItems: 'center' },
  optionGroup: {
    flexDirection: 'row',
    gap: 6,
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  optionGroupFocus: {
    borderColor: '#4f46e5',
    backgroundColor: '#4f46e511',
  },
  optionButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  optionButtonActive: { backgroundColor: '#4f46e5' },
  optionText: { fontSize: 15, fontWeight: '700', color: '#475569' },
  optionTextActive: { color: '#ffffff' },
  androidOption: { borderRadius: 12, backgroundColor: '#ddd6fe' },
});
