import axios from 'axios';
import { AccountStatus, TransactionResponse } from './interface';

const API_VERSION = 'v1';

export class RpcCaller {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async accountStatus(address: string) {
    return await this.call<AccountStatus>('globalstate/account', {
      accountId: {
        address,
      },
    });
  }

  async submitTransaction(signed: string) {
    return await this.call('transaction/submittransaction', signed);
  }

  // base64 encoded id
  async transactionState(id: string) {
    return await this.call<TransactionResponse>(
      'transaction/transactionsstate',
      { transactionId: [{ id }], includeTransactions: true },
    );
  }

  async call<T>(
    method: string,
    params: any,
    options: { timeout?: number } = {},
  ) {
    const apiAddress = `http://${this.baseUrl}/${API_VERSION}/${method}`;
    const response = await axios.post(apiAddress, params, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: options.timeout ?? 10000,
    });
    if (response.status === 200) {
      return response.data! as T;
    }
  }
}
