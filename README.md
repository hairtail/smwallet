smwallet
==================

A Spacemesh provider implementation and wallet utilities in TypeScript.

**Wallet:**

```typescript
import { Wallet } from 'smwallet';

// create
const mne = Wallet.generateMnemonice();

// recover with mnemonice
const masterWallet = Wallet.createWallet(mne);

// derive with index
const childWallet = Wallet.createWallet(mne, 1);

// bech32 encoded mainnet address
const address = Wallet.encodeAddress(childWallet.publicKey);
```

**Methods:**

- accountStatus
- submitTransaction
- transactionState
- genesisID
- accountMeshDataQuery

**Rpc Usage:**

```typescript
import { parseSmidge, RpcCaller, sendTransaction, spawnTransaction, toSmidge } from 'smwallet';

// http endpoint
const provider = new RpcCaller("127.0.0.1:9094");

// spawn
const genesis = await provider.genesisID();
const genesisUint8 = Uint8Array.from(Buffer.from(genesis?.genesisId ?? '', 'base64'));
const signed = spawnTransaction(childWallet.publicKey, childWallet.secretKey, 1, genesisUint8);

// query account balance and counter
const account = await provider.accountStatus(address);
const humanReadBalance = parseSmidge(account?.accountWrapper.stateProjected.balance.value);

// send 2 SMH to receiver
const signed = sendTransaction(childWallet.publicKey, childWallet.secretKey, toAddress, toSmidge(2), 1, genesisUint8, Number(account?.accountWrapper.stateProjected.counter))

// boradcast signed transaction to network
const tx = await provider.submitTransaction(Buffer.from(signed).toString('base64'));

// get all transactions of address
const txs = await provider.accountMeshDataQuery(address);

// get a specified transaction
const transaction = await provider.transactionState('base64 encoded transaction id');
```
