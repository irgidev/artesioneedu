import { useEffect, useRef, useCallback } from 'react';

// Timer hook for quiz
export function useTimer(isRunning, onTick) {
  const savedCallback = useRef();
  const intervalRef = useRef(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = onTick;
  }, [onTick]);

  // Set up interval
  useEffect(() => {
    if (isRunning) {
      const tick = () => {
        if (savedCallback.current) {
          savedCallback.current();
        }
      };
      intervalRef.current = setInterval(tick, 1000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { clear: () => clearInterval(intervalRef.current) };
}

// Local storage hook
export function useLocalStorage(key, initialValue) {
  const storedValue =
    JSON.parse(localStorage.getItem(`artesioneedu_${key}`)) ?? initialValue;
  
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      localStorage.setItem(`artesioneedu_${key}`, JSON.stringify(valueToStore));
      window.dispatchEvent(new CustomEvent('localStorageChange', { detail: { key } }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
