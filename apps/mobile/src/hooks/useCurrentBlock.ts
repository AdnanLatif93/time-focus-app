import { useEffect, useRef, useCallback, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import useAppDispatch from './useAppDispatch';
import useAppSelector from './useAppSelector';
import { setBlocks } from '@store/slices/scheduleSlice';
import {
  getCurrentBlock,
  CurrentBlockData,
  NextBlockData,
} from '@modules/current-block/api/currentBlockApi';

const POLL_INTERVAL_MS = 60_000; // 60 seconds

interface UseCurrentBlockResult {
  currentBlock: CurrentBlockData | null;
  nextBlock:    NextBlockData    | null;
  isLoading:    boolean;
  error:        string | null;
  refetch:      () => void;
}

const useCurrentBlock = (): UseCurrentBlockResult => {
  const dispatch = useAppDispatch();

  const [currentBlock, setCurrentBlock] = useState<CurrentBlockData | null>(null);
  const [nextBlock,    setNextBlock]    = useState<NextBlockData    | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef  = useRef<AppStateStatus>(AppState.currentState);

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const res = await getCurrentBlock();
      setCurrentBlock(res.currentBlock);
      setNextBlock(res.nextBlock);

      // Sync blocks into Redux if needed
      if (res.currentBlock) {
        dispatch(setBlocks([res.currentBlock]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch current block');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Initial fetch
  useEffect(() => {
    fetch();
  }, [fetch]);

  // Poll every 60 seconds
  useEffect(() => {
    intervalRef.current = setInterval(fetch, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetch]);

  // Refresh when app comes to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        fetch();
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [fetch]);

  return { currentBlock, nextBlock, isLoading, error, refetch: fetch };
};

export default useCurrentBlock;
