import { useState, useCallback, useRef, useEffect } from 'react';
import { useApp, useInput } from 'ink';

const EXIT_TIMEOUT_MS = 1000;

type ExitConfirmationState = {
  readonly pendingExit: boolean;
};

export function useExitConfirmation(): ExitConfirmationState {
  const { exit } = useApp();
  const [pendingExit, setPendingExit] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback((): void => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return (): void => {
      clearTimer();
    };
  }, [clearTimer]);

  useInput((_input, key) => {
    if (!key.ctrl || _input !== 'c') {
      return;
    }

    if (pendingExit) {
      clearTimer();
      exit();
      return;
    }

    setPendingExit(true);
    timerRef.current = setTimeout(() => {
      setPendingExit(false);
      timerRef.current = null;
    }, EXIT_TIMEOUT_MS);
  });

  return { pendingExit };
}
