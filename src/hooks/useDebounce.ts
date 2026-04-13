import { useState, useEffect } from "react";

/**
 * A custom hook that debounces a value.
 *
 * @template T - The type of value to debounce
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds (default: 280ms)
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const debouncedQuery = useDebounce(query, 280);
 *
 * useEffect(() => {
 *   // This will only run 280ms after `query` stops changing
 *   searchApi(debouncedQuery);
 * }, [debouncedQuery]);
 * ```
 */
function useDebounce<T>(value: T, delay: number = 280): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: clear timer if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
