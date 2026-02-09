export interface EmailValidationResponse {
  available: boolean
  message: string
}

export interface ShippingOption {
  id: string
  name: string
  price: number
  estimatedDays: string
}

export interface ShippingQuoteResponse {
  options: ShippingOption[]
}

export interface PaymentAuthResponse {
  authorized: boolean
  transactionId: string
}

export interface Order {
  orderId: string
  status: string
  total: number
}

export const checkoutApi = {
  validateEmail: async (email: string): Promise<EmailValidationResponse> => {
    const response = await fetch('/api/auth/validate-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error('Failed to validate email')
    }

    return response.json()
  },

  getShippingQuote: async (
    address: unknown
  ): Promise<ShippingQuoteResponse> => {
    const response = await fetch('/api/shipping/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address),
    })

    if (!response.ok) {
      throw new Error('Failed to get shipping quote')
    }

    return response.json()
  },

  authorizePayment: async (
    paymentData: unknown
  ): Promise<PaymentAuthResponse> => {
    const response = await fetch('/api/payment/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Payment authorization failed')
    }

    return response.json()
  },

  createOrder: async (orderData: unknown): Promise<Order> => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error('Failed to create order')
    }

    return response.json()
  },

  getSession: async () => {
    const response = await fetch('/api/session')

    if (!response.ok) {
      throw new Error('Failed to get session')
    }

    return response.json()
  },
}
