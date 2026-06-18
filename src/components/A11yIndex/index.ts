/**
 * `A11y.Index` — a positional element inside an `A11y.Order` sequence.
 *
 * Per the rework, it is the **same component** as `A11y.View` (backed by the one
 * merged native `A11yView`); supplying `index` (or rendering inside `A11y.Order`)
 * wires the screen-reader sequence key from context. This mirrors
 * react-native-a11y-order, where `A11yView` was an alias of `A11yIndex`.
 */
export { A11yView as A11yIndex } from '../A11yView';
export type { A11yViewProps as A11yIndexProps } from '../A11yView/A11yView.types';
