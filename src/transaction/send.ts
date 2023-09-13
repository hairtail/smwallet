import { SingleSigTemplate, TemplateRegistry } from '@spacemesh/sm-codec';
import { HexString, fromHexString } from '../account/utils';
import crypto from 'crypto';
import Bech32 from '@spacemesh/address-wasm';

export const sign = (dataBytes: Uint8Array, privateKey: HexString) => {
  const key = Buffer.concat([
    Buffer.from('302e020100300506032b657004220420', 'hex'), // DER privateKey prefix for ED25519
    Buffer.from(privateKey, 'hex'),
  ]);
  const pk = crypto.createPrivateKey({
    format: 'der',
    type: 'pkcs8',
    key,
  });
  return Uint8Array.from(crypto.sign(null, dataBytes, pk));
};

export const sendTransaction = (
  publicKey: string,
  secretKey: string,
  receiver: string,
  amount: number,
  fee: number,
  genesisID: Uint8Array,
  nonce?: number,
) => {
  const method = 16;
  const tpl = TemplateRegistry.get(SingleSigTemplate.key, method);
  const principal = tpl.principal({
    PublicKey: fromHexString(publicKey),
  });
  const payload = {
    Arguments: {
      Destination: Bech32.parse(receiver),
      Amount: BigInt(amount),
    },
    Nonce: BigInt(nonce || 1),
    GasPrice: BigInt(fee),
  };
  const txEncoded = tpl.encode(principal, payload);
  const sig = sign(new Uint8Array([...genesisID, ...txEncoded]), secretKey);
  const signed = tpl.sign(txEncoded, sig);
  return signed;
};
