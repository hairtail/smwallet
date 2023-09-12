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
  aaccountWrapper: {
    accountId: AccountId;
    stateCurrent: State;
    stateProjected: State;
  };
}
