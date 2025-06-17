import { useEffect, useRef } from 'react';

/**
 * A custom hook that executes a cleanup function when the component unmounts.
 * The cleanup function can be updated based on dependencies.
 *
 * @param fn - The cleanup function to be executed on unmount
 * @param deps - Array of dependencies that will trigger an update of the cleanup function
 */
export function useUnmount(fn: () => void, deps: any[]) {
  const cleanUpRef = useRef(fn);

  useEffect(() => {
    cleanUpRef.current = fn;
  }, deps);

  useEffect(() => {
    return () => {
      cleanUpRef.current();
    };
  }, []);
}
