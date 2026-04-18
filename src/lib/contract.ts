import { Contract, Address, scValToNative, nativeToScVal } from '@stellar/stellar-sdk';
import { rpc, TransactionBuilder, BASE_FEE } from '@stellar/stellar-sdk';
import { CONTRACT_ID } from '../constants';
import { rpcServer, getAccountForTx, networkPassphrase } from './stellar';
import { ContractError, AlreadyVotedError } from './errors';
import { signTransaction } from './walletsKit';

const getContract = () => {
  if (!CONTRACT_ID) {
    throw new ContractError('Contract ID is not configured. Please set VITE_CONTRACT_ID.');
  }
  return new Contract(CONTRACT_ID);
};

export const readPollData = async () => {
  try {
    const contract = getContract();
    const questionBuilder = contract.call('get_question');
    const resultsBuilder = contract.call('get_results');
    const totalVotesBuilder = contract.call('get_total_votes');

    const fallbackSource = 'GAFMU6AU7FKUTGKP473M3QVONNUS7OPMM4OAYYKTRRBZ4FAKMEXEDSG4';
    const tempAccount = await getAccountForTx(fallbackSource).catch(() => {
        return { sequenceNumber: () => '0', accountId: () => fallbackSource };
    }) as any;

    const [qSim, rSim, tSim] = await Promise.all([
      rpcServer.simulateTransaction(
        new TransactionBuilder(tempAccount, { fee: BASE_FEE, networkPassphrase })
          .addOperation(questionBuilder)
          .setTimeout(30)
          .build()
      ),
      rpcServer.simulateTransaction(
        new TransactionBuilder(tempAccount, { fee: BASE_FEE, networkPassphrase })
          .addOperation(resultsBuilder)
          .setTimeout(30)
          .build()
      ),
      rpcServer.simulateTransaction(
        new TransactionBuilder(tempAccount, { fee: BASE_FEE, networkPassphrase })
          .addOperation(totalVotesBuilder)
          .setTimeout(30)
          .build()
      )
    ]);

    let question = "Loading...";
    if (rpc.Api.isSimulationSuccess(qSim) && qSim.result) {
      question = scValToNative(qSim.result.retval);
    }

    let results: { [key: string]: number } = {};
    let options: string[] = [];
    if (rpc.Api.isSimulationSuccess(rSim) && rSim.result) {
      const resp = scValToNative(rSim.result.retval);
      resp.forEach((item: any) => {
        results[item[0]] = item[1];
        options.push(item[0]);
      });
    }

    let totalVotes = 0;
    if (rpc.Api.isSimulationSuccess(tSim) && tSim.result) {
      totalVotes = scValToNative(tSim.result.retval);
    }

    return { question, results, totalVotes, options };
  } catch (error) {
    console.error("Error reading poll data:", error);
    return {
      question: 'Contract not configured',
      options: [],
      results: {},
      totalVotes: 0,
    };
  }
};

export const checkHasVoted = async (publicKey: string) => {
  try {
    const contract = getContract();
    const tempAccount = await getAccountForTx(publicKey).catch(() => {
        return { sequenceNumber: () => '0', accountId: () => publicKey };
    }) as any;

    const op = contract.call('has_voted', new Address(publicKey).toScVal());
    const sim = await rpcServer.simulateTransaction(
      new TransactionBuilder(tempAccount, { fee: BASE_FEE, networkPassphrase })
        .addOperation(op)
        .setTimeout(30)
        .build()
    );

    if (rpc.Api.isSimulationSuccess(sim) && sim.result) {
      return scValToNative(sim.result.retval) as boolean;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const castVote = async (publicKey: string, optionIndex: number) => {
  const account = await getAccountForTx(publicKey);
  
  const contract = getContract();
  const voteOp = contract.call(
    'vote',
    new Address(publicKey).toScVal(),
    nativeToScVal(optionIndex, { type: 'u32' })
  );

  let tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase })
    .addOperation(voteOp)
    .setTimeout(30)
    .build();

  const sim = await rpcServer.simulateTransaction(tx);
  
  if (rpc.Api.isSimulationError(sim) && typeof sim.error === 'string') {
    if (sim.error.includes("Already voted")) throw new AlreadyVotedError();
    throw new ContractError(sim.error);
  }

  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new ContractError("Transaction simulation failed.");
  }
  tx = rpc.assembleTransaction(tx, sim).build() as any;
  const signedXdr = await signTransaction(tx.toXDR());
  const sendResult = await rpcServer.sendTransaction(TransactionBuilder.fromXDR(signedXdr, networkPassphrase) as any);
  
  if (sendResult.status === 'ERROR') {
    throw new ContractError("Transaction submitted but rejected by network.");
  }

  return sendResult.hash;
};

export const subscribeToEvents = (onEvent: (event: any) => void) => {
  if (!CONTRACT_ID) {
    console.warn('Skipping event subscription because contract ID is not configured.');
    return;
  }

  let lastCursor = "";
  const poll = async () => {
    try {
      const events = await rpcServer.getEvents({
        startLedger: 0,
        filters: [{ type: 'contract', contractIds: [CONTRACT_ID] }],
        limit: 10, 
      });
      
      if (events.events && events.events.length > 0) {
        if (lastCursor === "") {
          lastCursor = events.latestLedger.toString(); 
        } else {
           events.events.forEach((e) => {
               if (e.id > lastCursor) {
                   onEvent(e);
                   lastCursor = e.id;
               }
           });
        }
      }
    } catch (error) {
      console.warn("Event polling error:", error);
    }
    setTimeout(poll, 5000);
  };
  poll();
};
