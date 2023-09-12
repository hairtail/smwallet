export type HexString = string;
export const fromHexString = (hexString: HexString) => {
  const bytes: number[] = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.slice(i, i + 2), 16));
  }
  return Uint8Array.from(bytes);
};
export const toHexString = (
  bytes: Uint8Array | Buffer | ArrayBuffer,
): HexString =>
  bytes instanceof Buffer
    ? bytes.toString('hex')
    : new Uint8Array(bytes).reduce(
        (str: string, byte: number) => str + byte.toString(16).padStart(2, '0'),
        '',
      );

export enum CoinUnits {
  SMH = 'SMH',
  Smidge = 'Smidge',
}

export const toSMH = (smidge: number) => smidge / 10 ** 9;
export const toSmidge = (smh: number) => Math.round(smh * 10 ** 9);
const packValueAndUnit = (value: number, unit: string) => ({
  value: parseFloat(value.toFixed(3)).toString(),
  unit,
});
export const parseSmidge = (amount: number) => {
  // If amount is "falsy" (0 | undefined | null)
  if (!amount) return packValueAndUnit(0, CoinUnits.SMH);
  // Show `23.053 SMH` for big amount
  else if (amount >= 10 ** 9) {
    return packValueAndUnit(toSMH(amount), CoinUnits.SMH);
  }
  // Or `6739412 Smidge` (without dot) for small amount
  else if (!Number.isNaN(amount)) {
    return packValueAndUnit(amount, CoinUnits.Smidge);
  }
  // Show `0 SMH` for zero amount and NaN
  else {
    return packValueAndUnit(0, CoinUnits.SMH);
  }
};

export const validateAddress = (address: string): address is HexString => {
  const addressRegex = new RegExp(/^(\w+)1[a-zA-Z0-9]{45}$/);
  const r = addressRegex.test(address);
  return r;
};
