import { rpc, Networks, Account, Horizon } from '@stellar/stellar-sdk';
import { SOROBAN_RPC_URL, HORIZON_URL, NETWORK_PASSPHRASE } from '../constants';

export const rpcServer = new rpc.Server(SOROBAN_RPC_URL);
export const horizonServer = new Horizon.Server(HORIZON_URL);
export const networkPassphrase = NETWORK_PASSPHRASE;

export const getAccount = async (publicKey: string) => {
  const account = await horizonServer.loadAccount(publicKey);
  return account;
};

export const getAccountForTx = async (publicKey: string) => {
  const sourceAccount = await rpcServer.getAccount(publicKey);
  return new Account(publicKey, sourceAccount.sequenceNumber());
};
