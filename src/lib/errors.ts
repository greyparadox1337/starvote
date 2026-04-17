export class StarVoteError extends Error {
  code: string;
  action: string;

  constructor(message: string, code: string, action: string) {
    super(message);
    this.name = 'StarVoteError';
    this.code = code;
    this.action = action;
  }
}

export class WalletNotFoundError extends StarVoteError {
  constructor(walletName: string) {
    super(
      `The ${walletName} wallet extension was not found.`,
      'WALLET_NOT_FOUND',
      `Please install the ${walletName} extension to continue.`
    );
    this.name = 'WalletNotFoundError';
  }
}

export class TransactionRejectedError extends StarVoteError {
  constructor() {
    super(
      'Transaction was rejected by the user.',
      'TRANSACTION_REJECTED',
      'Please approve the transaction in your wallet to proceed.'
    );
    this.name = 'TransactionRejectedError';
  }
}

export class InsufficientBalanceError extends StarVoteError {
  constructor() {
    super(
      'Insufficient XLM balance to perform this transaction.',
      'INSUFFICIENT_BALANCE',
      'Use the Stellar Friendbot faucet to fund your testnet account.'
    );
    this.name = 'InsufficientBalanceError';
  }
}

export class AlreadyVotedError extends StarVoteError {
  constructor() {
    super(
      'You have already voted in this poll.',
      'ALREADY_VOTED',
      'Each address can only vote once.'
    );
    this.name = 'AlreadyVotedError';
  }
}

export class NetworkError extends StarVoteError {
  constructor() {
    super(
      'Failed to connect to the Stellar network.',
      'NETWORK_ERROR',
      'Check your internet connection or try again later.'
    );
    this.name = 'NetworkError';
  }
}

export class ContractError extends StarVoteError {
  constructor(message: string = 'Contract invocation failed.') {
    super(
      message,
      'CONTRACT_ERROR',
      'Ensure the poll is active and you are passing valid parameters.'
    );
    this.name = 'ContractError';
  }
}
