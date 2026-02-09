export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatCardNumber(cardNumber: string): string {
  return cardNumber.replace(/(\d{4})/g, '$1 ').trim()
}

export function maskCardNumber(cardNumber: string): string {
  return `**** **** **** ${cardNumber.slice(-4)}`
}
