import { http, HttpResponse, delay } from 'msw'
import { makeShippingQuote, makeOrder, makeSession } from './factories'

// Check URL params for failure modes
const shouldFail = (request: Request, type: string) => {
  const url = new URL(request.url)
  return url.searchParams.get('fail') === type
}

const shouldTimeout = (request: Request) => {
  const url = new URL(request.url)
  return url.searchParams.get('timeout') === 'true'
}

export const handlers = [
  // Email validation
  http.post('/api/auth/validate-email', async ({ request }) => {
    if (shouldTimeout(request)) {
      await delay(5000)
    }

    const body = (await request.json()) as { email: string }
    const { email } = body

    // Simulate taken emails
    const takenEmails = ['taken@example.com', 'admin@test.com']
    
    await delay(300) // Simulate network delay

    if (shouldFail(request, 'email')) {
      return new HttpResponse(null, { status: 500 })
    }

    if (takenEmails.includes(email)) {
      return HttpResponse.json(
        { available: false, message: 'Email already in use' },
        { status: 200 }
      )
    }

    return HttpResponse.json(
      { available: true, message: 'Email is available' },
      { status: 200 }
    )
  }),

  // Shipping quote
  http.post('/api/shipping/quote', async ({ request }) => {
    if (shouldTimeout(request)) {
      await delay(5000)
    }

    await delay(400)

    if (shouldFail(request, 'shipping')) {
      return new HttpResponse(null, { status: 500 })
    }

    return HttpResponse.json(
      { options: makeShippingQuote() },
      { status: 200 }
    )
  }),

  // Payment authorization
  http.post('/api/payment/authorize', async ({ request }) => {
    if (shouldTimeout(request)) {
      await delay(5000)
    }

    await delay(500)

    if (shouldFail(request, 'payment')) {
      return HttpResponse.json(
        { error: 'Payment authorization failed. Please try again.' },
        { status: 500 }
      )
    }

    return HttpResponse.json(
      {
        authorized: true,
        transactionId: `TXN-${Date.now()}`,
      },
      { status: 200 }
    )
  }),

  // Create order
  http.post('/api/orders', async ({ request }) => {
    if (shouldTimeout(request)) {
      await delay(5000)
    }

    await delay(600)

    if (shouldFail(request, 'order')) {
      return new HttpResponse(null, { status: 500 })
    }

    return HttpResponse.json(makeOrder(), { status: 201 })
  }),

  // Get session
  http.get('/api/session', async ({ request }) => {
    if (shouldTimeout(request)) {
      await delay(5000)
    }

    await delay(200)

    if (shouldFail(request, 'session')) {
      return new HttpResponse(null, { status: 500 })
    }

    return HttpResponse.json(
      { session: makeSession() },
      { status: 200 }
    )
  }),
]
