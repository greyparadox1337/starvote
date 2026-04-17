import { create } from 'zustand';

interface PollState {
  question: string;
  options: string[];
  results: { [key: string]: number };
  totalVotes: number;
  lastUpdated: number;
  isLoading: boolean;
  setPollData: (data: { question?: string; options?: string[]; results?: { [key: string]: number }; totalVotes?: number }) => void;
  setLoading: (loading: boolean) => void;
}

export const usePollStore = create<PollState>((set) => ({
  question: 'Loading...',
  options: [],
  results: {},
  totalVotes: 0,
  lastUpdated: Date.now(),
  isLoading: true,
  setPollData: (data) => set((state) => ({ ...state, ...data, lastUpdated: Date.now() })),
  setLoading: (isLoading) => set({ isLoading }),
}));
