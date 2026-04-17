import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Target } from 'lucide-react';
import { usePollStore } from '../../store/pollStore';
import { useTransaction } from '../../hooks/useTransaction';

export const VoteOption = ({ index, text, disabled, hasVoted }: { index: number, text: string, disabled: boolean, hasVoted: boolean }) => {
  const { results, totalVotes } = usePollStore();
  const { handleCastVote, status } = useTransaction();
  const [isVoting, setIsVoting] = useState(false);

  const count = results[text] || 0;
  const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
  
  const onClick = async () => {
    if (disabled) return;
    setIsVoting(true);
    try {
      await handleCastVote(index);
    } catch (e) {
      console.error(e);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isVoting || status === 'pending'}
      className="relative w-full h-14 bg-white/5 border border-white/10 rounded-xl overflow-hidden group disabled:cursor-not-allowed transition-colors hover:border-white/20"
    >
      <motion.div 
        className="absolute inset-y-0 left-0 bg-white/5 group-hover:bg-white/10 transition-colors"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <div className="absolute inset-0 px-4 flex items-center justify-between z-10 w-full">
        <div className="flex items-center gap-3">
            {hasVoted && disabled && <Lock className="w-4 h-4 text-white/40" />}
            {!hasVoted && !disabled && <Target className="w-4 h-4 text-white/40 group-hover:text-accent transition-colors hidden sm:block" />}
            <span className="font-medium text-left truncate">{text}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
            {isVoting ? (
              <span className="animate-spin border-2 border-white/20 border-t-white rounded-full w-4 h-4" />
            ) : (
                <span className="font-mono text-sm text-white/50">{percentage}% ({count})</span>
            )}
        </div>
      </div>
    </button>
  );
};
