import { SingleSigTemplate, TemplateRegistry } from '@spacemesh/sm-codec';
import { fromHexString } from '../account/utils';
import { sign } from './send';

export const spawnTransaction = (
  publicKey: string,
  secretKey: string,
  fee: number,
  genesisID: Uint8Array,
) => {
  const method = 0;
  const tpl = TemplateRegistry.get(SingleSigTemplate.key, method);
  const spawnArgs = { PublicKey: fromHexString(publicKey) };
  const principal = tpl.principal(spawnArgs);
  const payload = {
    Nonce: BigInt(0),
    GasPrice: BigInt(fee),
    Arguments: spawnArgs,
  };
  const txEncoded = tpl.encode(principal, payload);
  const sig = sign(new Uint8Array([...genesisID, ...txEncoded]), secretKey);
  const signed = tpl.sign(txEncoded, sig);
  return signed;
};
