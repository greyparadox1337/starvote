import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ExternalLink, Loader2, X } from 'lucide-react';
import { useTransaction } from '../../hooks/useTransaction';

export const TxStatusBar = () => {
  const { status, hash, dismissTx, errorMsg } = useTransaction();

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(dismissTx, 8000);
      return () => clearTimeout(timer);
    }
  }, [status, dismissTx]);

  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div className="glass !bg-dark-900/90 rounded-2xl p-4 flex items-center gap-4 shadow-2xl border-white/20">
            {status === 'pending' && <Loader2 className="w-6 h-6 text-accent animate-spin shrink-0" />}
            {status === 'success' && <CheckCircle className="w-6 h-6 text-success shrink-0" />}
            {status === 'error' && <XCircle className="w-6 h-6 text-error shrink-0" />}

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">
                {status === 'pending' && 'Transaction in flight...'}
                {status === 'success' && 'Transaction successful!'}
                {status === 'error' && (errorMsg || 'Transaction failed')}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                {hash && (
                  <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/50 hover:text-accent flex items-center gap-1 font-mono truncate"
                  >
                    {hash.slice(0, 16)}... <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                )}
              </div>
            </div>

            <button onClick={dismissTx} className="p-2 hover:bg-white/10 rounded-full shrink-0">
              <X className="w-4 h-4 text-white/50" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
