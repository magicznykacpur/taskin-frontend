import { useEffect, useRef } from "react";

type Timer = ReturnType<typeof setTimeout>;

const useDebounce = (f: (...args: any[]) => void, delay: number) => {
  const timer = useRef<Timer>(null);

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  const debouncedFunc = (...args: any[]) => {
    const newTimer = setTimeout(() => {
      f(...args);
    }, delay);

    clearTimeout(timer.current!);
    timer.current = newTimer;
  };

  return debouncedFunc;
};

export default useDebounce;