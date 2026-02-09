import { describe, it, expect } from 'vitest'
import { accountSchema } from '@/features/checkout/schemas/accountSchema'
import { shippingSchema } from '@/features/checkout/schemas/shippingSchema'
import { paymentSchema } from '@/features/checkout/schemas/paymentSchema'

describe('Account Schema Validation', () => {
  it('should accept valid account data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123',
    }

    const result = accountSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'not-an-email',
      password: 'Password123',
    }

    const result = accountSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0]?.message).toContain('Invalid email')
    }
  })

  it('should reject short password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Short1',
    }

    const result = accountSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0]?.message).toContain('at least 8 characters')
    }
  })

  it('should reject password without uppercase', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'password123',
    }

    const result = accountSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject password without numbers', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'PasswordABC',
    }

    const result = accountSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('Shipping Schema Validation', () => {
  it('should accept valid shipping data', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    }

    const result = shippingSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid state code', () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NEW YORK',
      zipCode: '10001',
    }

    const result = shippingSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject invalid ZIP code format', () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '123',
    }

    const result = shippingSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0]?.message).toContain('Invalid ZIP code')
    }
  })

  it('should accept extended ZIP code format', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001-1234',
    }

    const result = shippingSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})

describe('Payment Schema Validation', () => {
  it('should accept valid payment data', () => {
    const validData = {
      cardNumber: '4111111111111111',
      cardName: 'John Doe',
      expiryDate: '12/25',
      cvv: '123',
    }

    const result = paymentSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid card number length', () => {
    const invalidData = {
      cardNumber: '4111',
      cardName: 'John Doe',
      expiryDate: '12/25',
      cvv: '123',
    }

    const result = paymentSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject invalid expiry date format', () => {
    const invalidData = {
      cardNumber: '4111111111111111',
      cardName: 'John Doe',
      expiryDate: '13/25',
      cvv: '123',
    }

    const result = paymentSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should accept 4-digit CVV', () => {
    const validData = {
      cardNumber: '4111111111111111',
      cardName: 'John Doe',
      expiryDate: '12/25',
      cvv: '1234',
    }

    const result = paymentSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})
