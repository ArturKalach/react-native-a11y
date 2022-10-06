export const debounce = (callback: () => void, timeout = 100) => {
  let timer: NodeJS.Timeout | null;
  return () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(callback, timeout);
  };
};
