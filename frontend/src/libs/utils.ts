export function convertAmountToMilliunits(amount: number): number {
  return Math.round(amount * 1000)
}

export function convertMilliunitsToAmount(milliunits: number): number {
  return milliunits / 1000
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}