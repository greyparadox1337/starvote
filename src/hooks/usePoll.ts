import { useEffect, useCallback } from 'react';
import { usePollStore } from '../store/pollStore';
import { readPollData } from '../lib/contract';

export const usePoll = () => {
  const store = usePollStore();

  const refreshPoll = useCallback(async () => {
    try {
      store.setLoading(true);
      const data = await readPollData();
      store.setPollData(data);
    } catch (error) {
      console.error("Failed to refresh poll:", error);
    } finally {
      store.setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPoll();
  }, [refreshPoll]);

  return { ...store, refreshPoll };
};
