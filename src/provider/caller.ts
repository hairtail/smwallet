import axios from 'axios';
import { AccountStatus } from './interface';

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
