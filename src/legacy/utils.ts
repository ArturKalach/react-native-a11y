/** No-op debounce/util helpers ported from react-native-a11y@0.7. */

export const noop = () => {};

export const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  timeout = 100
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => callback(...args), timeout);
  };
};
