interface AccountId {
  address: string;
}

interface Balance {
  value: string;
}

interface State {
  counter: string;
  balance: Balance;
}

export interface AccountStatus {
  accountWrapper: {
    accountId: AccountId;
    stateCurrent: State;
    stateProjected: State;
  };
}

interface TransactionState {
  id: {
    id: string;
  };
  state: string;
}

interface Transaction {
  id: string;
  principal: { address: string };
  template: { address: string };
  method: number;
  nonce: { counter: string; bitfield: number };
  limits: { min: number; max: number };
  maxGas: string;
  gasPrice: string;
  maxSpend: string;
  raw: string;
}

export interface TransactionResponse {
  transactionsState: TransactionState[];
  transactions: Transaction[];
}

export interface GenesisID {
  genesisId: string;
}

interface MeshTransaction {
  transaction: Transaction;
  layerId: { number: number };
}

export interface AccountMeshQueryResponse {
  data: MeshTransaction[];
  totalResults: number;
}
