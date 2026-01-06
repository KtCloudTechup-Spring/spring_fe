import { useState, useEffect, useCallback } from "react";

export function useCountdown(initialSeconds: number = 300) {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const start = useCallback(() => {
    setSeconds(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  const reset = useCallback(() => {
    setSeconds(0);
    setIsActive(false);
  }, []);

  const formatTime = useCallback((totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    seconds,
    isActive,
    start,
    reset,
    formatTime,
  };
}
