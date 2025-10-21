export function debounce<TArgs extends unknown[]>(
  func: (...args: TArgs) => void,
  delay: number
): ((...args: TArgs) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const debouncedFunction = ((...args: TArgs) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  }) as ((...args: TArgs) => void) & { cancel: () => void };

  debouncedFunction.cancel = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  return debouncedFunction;
}