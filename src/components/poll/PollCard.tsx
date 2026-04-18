import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { usePoll } from '../../hooks/usePoll';
import { VoteOption } from './VoteOption';
import { ResultsChart } from './ResultsChart';
import { Badge } from '../ui/Badge';
import { useWalletStore } from '../../store/walletStore';
import { checkHasVoted } from '../../lib/contract';
import { motion } from 'framer-motion';

export const PollCard = () => {
  const { question, options, isLoading, lastUpdated, totalVotes } = usePoll();
  const publicKey = useWalletStore(s => s.publicKey);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (publicKey) {
      checkHasVoted(publicKey).then(setHasVoted);
    } else {
      setHasVoted(false);
    }
  }, [publicKey, lastUpdated]);

  if (isLoading && question === 'Loading...') {
    return (
      <GlassCard className="w-full max-w-2xl mx-auto min-h-[400px] flex items-center justify-center">
        <span className="animate-spin border-4 border-white/20 border-t-accent rounded-full w-12 h-12" />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="w-full max-w-2xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{question}</h1>
        <Badge variant="error" className="shrink-0">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
          LIVE
        </Badge>
      </div>

      <div className="text-sm text-white/50 flex justify-between">
        <span>Total Votes: {totalVotes}</span>
        <span>Last Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
      </div>

      <div className="grid gap-3">
        {options.length === 0 ? (
          <div className="rounded-2xl border border-white/10 p-6 text-white/70 bg-white/5">
            No poll options found. Please configure a valid contract ID with <code className="rounded bg-white/10 px-1 py-0.5">VITE_CONTRACT_ID</code>.
          </div>
        ) : (
          options.map((opt, i) => (
            <VoteOption 
              key={i} 
              index={i} 
              text={opt} 
              disabled={hasVoted || !publicKey} 
              hasVoted={hasVoted}
            />
          ))
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="pt-8 border-t border-white/10 overflow-hidden"
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Real-time Results
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
        </h3>
        <ResultsChart />
      </motion.div>
    </GlassCard>
  );
};
