export const debounce = <T extends Function>(callback: T, timeout = 100) => {
  let timer: NodeJS.Timeout | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => callback(args), timeout);
  };
};
