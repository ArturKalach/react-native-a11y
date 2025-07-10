import { useRef, useCallback, type RefObject, useMemo } from 'react';
import { View } from 'react-native';

import { A11yModule } from '../../../modules';
import { debounce } from '../../../utils';

const SECONDS_PER_FRAME = 16;
const COUNT_OF_FRAMES = 1;

const DEBOUNCE_DELAY = SECONDS_PER_FRAME * COUNT_OF_FRAMES;

export const useA11yOrderManager = <T>(orderRef: RefObject<View>) => {
  const currentRef = useRef<(T | null)[]>([]);
  const registeredRefs = useRef<(T | null)[]>([]);

  const refWasUpdated = useRef<boolean>(false);

  const setOrder = useCallback(() => {
    A11yModule.setA11yElementsOrder({
      tag: orderRef,
      views: registeredRefs.current,
    });
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
    currentRef.current = registeredRefs.current.filter((v) => v);

    debounceOrder();
  }, [debounceOrder]);

  const reset = useCallback(() => {
    currentRef.current = [];
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
