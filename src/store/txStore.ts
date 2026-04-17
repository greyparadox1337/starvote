import { create } from 'zustand';

export type TxStatus = 'pending' | 'success' | 'error' | 'idle';

interface TxHistoryItem {
  hash: string;
  status: TxStatus;
  optionIndex: number;
  timestamp: number;
}

interface TxState {
  currentTx: {
    hash: string | null;
    status: TxStatus;
    optionIndex: number | null;
    errorMsg?: string;
  };
  txHistory: TxHistoryItem[];
  setCurrentTx: (tx: { hash?: string | null; status?: TxStatus; optionIndex?: number | null; errorMsg?: string }) => void;
  addHistoryItem: (item: TxHistoryItem) => void;
}

export const useTxStore = create<TxState>((set) => ({
  currentTx: {
    hash: null,
    status: 'idle',
    optionIndex: null,
  },
  txHistory: JSON.parse(localStorage.getItem('txHistory') || '[]'),
  setCurrentTx: (tx) => set((state) => ({
    currentTx: { ...state.currentTx, ...tx }
  })),
  addHistoryItem: (item) => set((state) => {
    const updated = [item, ...state.txHistory];
    localStorage.setItem('txHistory', JSON.stringify(updated));
    return { txHistory: updated };
  }),
}));
