import { useEffect, useState } from 'react';

/**
 * Hook to debounce a value.
 *
 * @template T The type of the value.
 * @param {T} value The value to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {T} The debounced value.
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
