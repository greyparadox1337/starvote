import { useTxStore } from '../store/txStore';
import { castVote } from '../lib/contract';
import { useWalletStore } from '../store/walletStore';
import { usePollStore } from '../store/pollStore';

export const useTransaction = () => {
  const { currentTx, setCurrentTx, addHistoryItem } = useTxStore();
  const { publicKey } = useWalletStore();
  const { options, results, totalVotes, setPollData } = usePollStore();

  const handleCastVote = async (optionIndex: number) => {
    if (!publicKey) throw new Error("Wallet not connected");

    setCurrentTx({ status: 'pending', optionIndex, hash: null });
    
    try {
      const hash = await castVote(publicKey, optionIndex);
      setCurrentTx({ status: 'success', hash });
      addHistoryItem({
        hash,
        status: 'success',
        optionIndex,
        timestamp: Date.now()
      });

      // Optimistic Update
      const optionText = options[optionIndex];
      if (optionText) {
          const newTotal = totalVotes + 1;
          const newCount = (results[optionText] || 0) + 1;
          setPollData({ totalVotes: newTotal, results: { ...results, [optionText]: newCount }});
      }

    } catch (error: any) {
      const errorMsg = error?.name === 'AlreadyVotedError' 
        ? 'You have already cast your vote!' 
        : 'Transaction failed to simulate or submit.';
      setCurrentTx({ status: 'error', errorMsg });
      throw error;
    }
  };

  const dismissTx = () => {
    setCurrentTx({ status: 'idle', hash: null, optionIndex: null });
  };

  return { ...currentTx, handleCastVote, dismissTx };
};
