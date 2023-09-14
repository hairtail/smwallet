import axios from 'axios';
import {
  AccountMeshQueryResponse,
  AccountStatus,
  GenesisID,
  TransactionResponse,
} from './interface';

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
    return await this.call('transaction/submittransaction', {
      transaction: signed,
    });
  }

  // base64 encoded id
  async transactionState(id: string) {
    return await this.call<TransactionResponse>(
      'transaction/transactionsstate',
      { transactionId: [{ id }], includeTransactions: true },
    );
  }

  async genesisID() {
    return await this.call<GenesisID>('mesh/genesisid', {});
  }

  async accountMeshDataQuery(address: string) {
    return await this.call<AccountMeshQueryResponse>(
      'mesh/accountmeshdataquery',
      {
        filter: { account_id: { address }, account_mesh_data_flags: 1 },
      },
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
