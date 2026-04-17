import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventListener } from '../../hooks/useEventListener';
import { GlassCard } from '../ui/GlassCard';
import { Activity } from 'lucide-react';
import { usePollStore } from '../../store/pollStore';

export const ActivityFeed = () => {
  const { feed } = useEventListener();
  const { options } = usePollStore();

  return (
    <GlassCard className="h-[400px] overflow-hidden flex-col hidden lg:flex">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10 shrink-0">
        <Activity className="w-5 h-5 text-accent" />
        <h3 className="font-semibold">Live Activity</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {feed.length === 0 ? (
               <div className="text-white/40 text-sm text-center py-8">Waiting for network events...</div>
            ) : feed.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/5 rounded-lg p-3 text-sm flex gap-3 items-center border border-white/5"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent shrink-0 flex items-center justify-center font-mono text-xs overflow-hidden">
                  {item.address.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-mono text-white/70 truncate mr-2">{item.address}</span>
                    <span className="text-xs text-white/40 shrink-0">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-white/90 truncate">
                    Voted for <span className="text-accent">{options[item.optionIndex] || `Option ${item.optionIndex + 1}`}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
};
