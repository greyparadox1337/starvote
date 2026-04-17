import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID
} from '@creit.tech/stellar-wallets-kit';
import { NETWORK_PASSPHRASE } from '../constants';

export const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: allowAllModules(),
});

export const connectWallet = async (walletId: string) => {
  kit.setWallet(walletId);
  await kit.getAddress(); 
  const { address } = await kit.getAddress();
  return address;
};

export const disconnectWallet = async () => {
  return true;
};

export const getPublicKey = async () => {
  const { address } = await kit.getAddress();
  return address;
};

export const signTransaction = async (xdr: string) => {
  const kitAny = kit as any;
  const res = kitAny.signTransaction ? await kitAny.signTransaction(xdr, { networkPassphrase: NETWORK_PASSPHRASE }) : await kitAny.sign({ xdr, networkPassphrase: NETWORK_PASSPHRASE });
  return res.signedXDR || res.signedTxXdr || res;
};
