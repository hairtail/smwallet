import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39';
import { fromHexString, toHexString } from './utils';
import Bip32KeyDerivation from './bip32-key-der';
import { SingleSigTemplate, TemplateRegistry } from '@spacemesh/sm-codec';
import Bech32 from '@spacemesh/address-wasm';

export class Wallet {
  static generateMnemonice = () => generateMnemonic();

  static createWallet = (mnemonic: string, walletIndex = 0) => {
    const seed = mnemonicToSeedSync(mnemonic);
    const path = Bip32KeyDerivation.createWalletPath(walletIndex);
    const keyPair = Bip32KeyDerivation.derivePath(path, seed);

    return {
      mnemonic,
      walletPath: path,
      publicKey: toHexString(keyPair.publicKey),
      secretKey: toHexString(keyPair.secretKey),
      address: toHexString(keyPair.publicKey),
    };
  };

  static deriveNewKeyPair = ({
    mnemonic,
    index,
  }: {
    mnemonic: string;
    index: number;
  }) => {
    return Wallet.createWallet(mnemonic, index);
  };

  static validateMnemonic = ({ mnemonic }: { mnemonic: string }) => {
    if (!mnemonic || !mnemonic.length) {
      return false;
    }
    return validateMnemonic(mnemonic);
  };

  static encodeAddress = (publicKey: string) => {
    const pkBytes = fromHexString(publicKey);
    const tpl = TemplateRegistry.get(SingleSigTemplate.key, 0);
    const principal = tpl.principal({ PublicKey: pkBytes });
    const address = Bech32.generateAddress(principal);
    return address;
  };
}
