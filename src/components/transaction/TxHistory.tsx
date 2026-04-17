import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useTxStore } from '../../store/txStore';
import { Badge } from '../ui/Badge';
import { usePollStore } from '../../store/pollStore';

export const TxHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { txHistory } = useTxStore();
  const { options } = usePollStore();

  if (txHistory.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 px-4 sm:px-0 relative z-20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mx-auto py-2"
      >
        <span>Transaction History</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-2xl mt-2 max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-white/50 bg-white/5 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Hash</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Option</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {txHistory.map((item, i) => (
                    <tr key={i} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-mono text-xs">
                        <a 
                           href={`https://stellar.expert/explorer/testnet/tx/${item.hash}`} 
                           target="_blank" 
                           rel="noreferrer"
                           className="flex items-center gap-1 hover:text-accent"
                        >
                          {item.hash.slice(0, 8)}...<ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={item.status === 'success' ? 'success' : 'error'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-white/80">{options[item.optionIndex] || `Option ${item.optionIndex + 1}`}</td>
                      <td className="px-4 py-3 text-white/50">{new Date(item.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
