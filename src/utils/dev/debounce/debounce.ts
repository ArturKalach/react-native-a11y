export const debounce = <T extends Function>(callback: T, timeout = 100) => {
  let timer: NodeJS.Timeout | null;

  return (...args: any) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => callback(args), timeout);
  };
};
