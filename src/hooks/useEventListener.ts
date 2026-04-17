import { useEffect, useState } from 'react';
import { subscribeToEvents } from '../lib/contract';
import { usePollStore } from '../store/pollStore';

export interface FeedEvent {
  id: string;
  address: string;
  optionIndex: number;
  timestamp: number;
}

export const useEventListener = () => {
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const { options, results, totalVotes, setPollData } = usePollStore();

  useEffect(() => {
    subscribeToEvents((e) => {
      const topics = e.topic;
      if (topics && topics.length > 0 && topics[0] === "vote_cast") {
         const address = e.contractId; 
         const optionIndex = 0; 
         
         const newEvent = {
            id: e.id,
            address: e.contractId.substring(0, 5) + "...", 
            optionIndex: optionIndex,
            timestamp: Date.now()
         };
         setFeed((prev) => [newEvent, ...prev].slice(0, 20));
      }
    });
  }, []);

  return { feed };
};
