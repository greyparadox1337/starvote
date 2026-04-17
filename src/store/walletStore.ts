import { create } from 'zustand';

interface WalletState {
  publicKey: string | null;
  balance: string;
  walletId: string | null;
  isConnecting: boolean;
  setPublicKey: (key: string | null) => void;
  setBalance: (balance: string) => void;
  setWalletId: (id: string | null) => void;
  setIsConnecting: (connecting: boolean) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  publicKey: null,
  balance: '0',
  walletId: null,
  isConnecting: false,
  setPublicKey: (publicKey) => set({ publicKey }),
  setBalance: (balance) => set({ balance }),
  setWalletId: (walletId) => set({ walletId }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),
}));
