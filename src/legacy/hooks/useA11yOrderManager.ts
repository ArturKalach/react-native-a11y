import { useRef, useCallback, useMemo, type RefObject } from 'react';
import { findNodeHandle, type View } from 'react-native';

import NativeA11yOrderModule from '../../nativeSpecs/NativeA11yOrderModule';
import { debounce } from '../utils';

const SECONDS_PER_FRAME = 16;
const COUNT_OF_FRAMES = 1;

const DEBOUNCE_DELAY = SECONDS_PER_FRAME * COUNT_OF_FRAMES;

let warnedMissingModule = false;

/**
 * In dev, surface the common cause of "order does nothing": the native
 * `A11yOrderModule` is a new TurboModule, so a rebuild (`pod install` on iOS /
 * gradle sync on Android) is required after upgrading — otherwise the module
 * resolves to `null` and the imperative hooks silently no-op.
 */
const warnIfNotLinked = () => {
  if (__DEV__ && !warnedMissingModule && NativeA11yOrderModule == null) {
    warnedMissingModule = true;
    console.warn(
      "[react-native-a11y] Legacy.useFocusOrder/useDynamicFocusOrder: the native 'A11yOrderModule' is not linked. " +
        'Rebuild the app (run `pod install` on iOS) so codegen registers it.'
    );
  }
};

/**
 * Internal order registry for the legacy imperative hooks. Collects numbered
 * child refs and, one frame after the last change, resolves them to native tags
 * and hands the ordered list to the {@link NativeA11yOrderModule}. Faithful port
 * of the 0.7 `useA11yOrderManager`, retargeted off the removed `A11yModule`.
 */
export const useA11yOrderManager = <T>(orderRef: RefObject<View>) => {
  const registeredRefs = useRef<(T | null)[]>([]);
  const refWasUpdated = useRef<boolean>(false);

  const setOrder = useCallback(() => {
    const containerTag = findNodeHandle(orderRef.current) ?? -1;
    const viewTags = registeredRefs.current.reduce<number[]>((tags, ref) => {
      if (ref != null) {
        const tag = findNodeHandle(ref as Parameters<typeof findNodeHandle>[0]);
        if (tag != null) {
          tags.push(tag);
        }
      }
      return tags;
    }, []);

    warnIfNotLinked();
    NativeA11yOrderModule?.setA11yOrder(viewTags, containerTag);
  }, [orderRef]);

  const debounceOrder = useMemo(
    () => debounce(setOrder, DEBOUNCE_DELAY),
    [setOrder]
  );

  const registerOrderRef = useCallback(
    (order: number) =>
      (ref: T | null): void => {
        refWasUpdated.current = true;
        registeredRefs.current[order] = ref;
      },
    []
  );

  const updateRefList = useCallback(() => {
    if (!refWasUpdated.current) {
      return;
    }

    refWasUpdated.current = false;
    debounceOrder();
  }, [debounceOrder]);

  const reset = useCallback(() => {
    registeredRefs.current = [];
    refWasUpdated.current = false;
  }, []);

  return {
    registerOrderRef,
    updateRefList,
    reset,
    setOrder,
  };
};
