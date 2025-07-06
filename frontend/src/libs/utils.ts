export function convertAmountToMilliunits(amount: number): number {
  return Math.round(amount * 1000)
}

export function convertMilliunitsToAmount(milliunits: number): number {
  return milliunits / 1000
}