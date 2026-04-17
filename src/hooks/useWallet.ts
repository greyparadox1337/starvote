import { useEffect } from 'react';
import { useWalletStore } from '../store/walletStore';
import { connectWallet as connectKitWallet, disconnectWallet as disconnectKitWallet } from '../lib/walletsKit';
import { getAccount } from '../lib/stellar';

export const useWallet = () => {
  const {
    publicKey,
    walletId,
    balance,
    isConnecting,
    setPublicKey,
    setBalance,
    setWalletId,
    setIsConnecting
  } = useWalletStore();

  const handleConnect = async (id: string) => {
    setIsConnecting(true);
    try {
      const address = await connectKitWallet(id);
      setPublicKey(address);
      setWalletId(id);
      await fetchBalance(address);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectKitWallet();
    setPublicKey(null);
    setWalletId(null);
    setBalance('0');
  };

  const fetchBalance = async (address: string) => {
    try {
      const account = await getAccount(address);
      const xlmBalance = account.balances.find((b: any) => b.asset_type === 'native');
      if (xlmBalance) {
        setBalance(xlmBalance.balance);
      }
    } catch (e) {
      console.warn("Failed to fetch balance, probably not funded", e);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchBalance(publicKey);
    }
  }, [publicKey]);

  return { publicKey, walletId, balance, isConnecting, connect: handleConnect, disconnect: handleDisconnect };
};
