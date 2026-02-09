import { describe, it, expect } from 'vitest'
import { formatCurrency, formatCardNumber, maskCardNumber } from '@/features/checkout/utils/formatters'

describe('formatCurrency', () => {
  it('should format number as USD currency', () => {
    expect(formatCurrency(10.99)).toBe('$10.99')
    expect(formatCurrency(100)).toBe('$100.00')
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('should handle negative numbers', () => {
    expect(formatCurrency(-10.50)).toBe('-$10.50')
  })
})

describe('formatCardNumber', () => {
  it('should format card number with spaces', () => {
    const result = formatCardNumber('4111111111111111')
    expect(result).toBe('4111 1111 1111 1111')
  })

  it('should handle empty string', () => {
    const result = formatCardNumber('')
    expect(result).toBe('')
  })
})

describe('maskCardNumber', () => {
  it('should mask all but last 4 digits', () => {
    const result = maskCardNumber('4111111111111111')
    expect(result).toBe('**** **** **** 1111')
  })

  it('should show only last 4 digits', () => {
    const result = maskCardNumber('4111111111111111')
    expect(result).toContain('1111')
    expect(result).not.toContain('4111111111111111')
  })
})
