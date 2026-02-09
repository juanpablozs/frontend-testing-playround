export interface ShippingOption {
  id: string
  name: string
  price: number
  estimatedDays: string
}

export interface Order {
  orderId: string
  status: string
  total: number
}

export const makeShippingQuote = (
  overrides?: Partial<ShippingOption>[]
): ShippingOption[] => {
  const defaults: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 5.99,
      estimatedDays: '5-7 business days',
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: 12.99,
      estimatedDays: '2-3 business days',
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      price: 24.99,
      estimatedDays: 'Next business day',
    },
  ]

  if (!overrides) return defaults

  return defaults.map((option, index) => ({
    ...option,
    ...overrides[index],
  }))
}

export const makeOrder = (overrides?: Partial<Order>): Order => ({
  orderId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  status: 'confirmed',
  total: 105.99,
  ...overrides,
})

export const makeSession = () => ({
  account: {
    email: 'test@example.com',
    password: 'password123',
  },
  shipping: {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    selectedOption: 'standard',
  },
  payment: {
    cardNumber: '4111111111111111',
    cardName: 'John Doe',
    expiryDate: '12/25',
    cvv: '123',
  },
})
