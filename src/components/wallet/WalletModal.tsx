import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { useWallet } from '../../hooks/useWallet';
import { X, ExternalLink } from 'lucide-react';

const WALLETS = [
  { id: 'freighter', name: 'Freighter'},
  { id: 'xbull', name: 'xBull'},
  { id: 'albedo', name: 'Albedo'},
  { id: 'rabet', name: 'Rabet'},
  { id: 'lobster', name: 'Lobstr'},
  { id: 'hana', name: 'Hana'},
  { id: 'walletconnect', name: 'WalletConnect'},
];

export const WalletModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { connect, isConnecting } = useWallet();

  const handleConnect = async (id: string) => {
    try {
      await connect(id);
      onClose();
    } catch (e) {
      // Errors handled elsewhere usually
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard className="!p-0 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h2 className="text-xl font-bold">Connect Wallet</h2>
                  <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-5 h-5 text-white/70" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="grid gap-3">
                    {WALLETS.map(w => (
                      <button
                        key={w.id}
                        onClick={() => handleConnect(w.id)}
                        disabled={isConnecting}
                        className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex items-center justify-between transition-all group"
                      >
                        <span className="font-medium">{w.name}</span>
                        <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-accent transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 border-t border-white/10 text-center text-xs text-white/40">
                  Powered by StellarWalletsKit
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
