// 鐣寗閽熻鏃跺櫒 Hook

const { useState, useEffect, useRef, useCallback } = React;

function useTimer(initialMinutes = 25) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedRemainingRef = useRef(null);

  const progress = totalSeconds > 0
    ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100
    : 0;

  // 娓呯悊
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // 璁℃椂閫昏緫
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    setIsCompleted(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback((minutes) => {
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(false);
    const secs = (minutes || totalSeconds / 60) * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
  }, [totalSeconds]);

  const setMinutes = useCallback((minutes) => {
    const secs = minutes * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(false);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return {
    totalSeconds,
    remainingSeconds,
    isRunning,
    isCompleted,
    isPaused,
    progress,
    displayTime: formatTime(remainingSeconds),
    start,
    pause,
    resume,
    reset,
    setMinutes,
  };
}
