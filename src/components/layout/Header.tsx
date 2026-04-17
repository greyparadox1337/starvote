import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { WalletModal } from '../wallet/WalletModal';
import { useWallet } from '../../hooks/useWallet';

export const Header = () => {
  const { publicKey, balance, disconnect } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-dark-900/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-8 h-8 text-accent animate-pulse" />
              <span className="text-2xl font-bold font-mono tracking-tight text-white">
                Star<span className="text-gradient">Vote</span>
              </span>
            </div>
            <Badge variant="warn" className="hidden sm:flex">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              Testnet
            </Badge>
          </div>

          <div>
            {publicKey ? (
              <div className="flex items-center gap-3">
                <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-white/70 font-mono">{formatAddress(publicKey)}</span>
                  <span className="text-sm font-semibold text-accent">{parseFloat(balance).toFixed(2)} XLM</span>
                </div>
                <Button variant="outline" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsModalOpen(true)}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
