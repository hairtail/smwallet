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
