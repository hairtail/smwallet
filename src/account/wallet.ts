import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39';
import { toHexString } from '../utils';
import Bip32KeyDerivation from './bip32-key-der';

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

  validateMnemonic = ({ mnemonic }: { mnemonic: string }) => {
    if (!mnemonic || !mnemonic.length) {
      return false;
    }
    return validateMnemonic(mnemonic);
  };
}
