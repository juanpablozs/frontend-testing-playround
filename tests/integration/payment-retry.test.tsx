import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import { ReviewStep } from '@/features/checkout/pages/ReviewStep'
import { useCheckoutStore } from '@/features/checkout/store/checkoutStore'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Payment Retry Integration', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    useCheckoutStore.setState({
      account: { email: 'test@example.com', password: 'Password123' },
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
      orderId: null,
    })
  })

  it('should show error when payment fails', async () => {
    // Mock payment failure
    server.use(
      http.post('/api/payment/authorize', () => {
        return HttpResponse.json(
          { error: 'Payment authorization failed. Please try again.' },
          { status: 500 }
        )
      })
    )

    const user = userEvent.setup()
    render(<ReviewStep />)

    const placeOrderButton = screen.getByRole('button', { name: /place order/i })
    await user.click(placeOrderButton)

    await waitFor(() => {
      expect(screen.getByText(/payment error/i)).toBeInTheDocument()
      expect(screen.getByText(/payment authorization failed/i)).toBeInTheDocument()
    })
  })

  it('should show retry button on payment failure', async () => {
    server.use(
      http.post('/api/payment/authorize', () => {
        return HttpResponse.json(
          { error: 'Payment authorization failed. Please try again.' },
          { status: 500 }
        )
      })
    )

    const user = userEvent.setup()
    render(<ReviewStep />)

    const placeOrderButton = screen.getByRole('button', { name: /place order/i })
    await user.click(placeOrderButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry payment/i })).toBeInTheDocument()
    })
  })

  it('should succeed on retry after initial failure', async () => {
    let callCount = 0

    server.use(
      http.post('/api/payment/authorize', () => {
        callCount++
        if (callCount === 1) {
          return HttpResponse.json(
            { error: 'Payment authorization failed. Please try again.' },
            { status: 500 }
          )
        }
        return HttpResponse.json({
          authorized: true,
          transactionId: 'TXN-123',
        })
      })
    )

    const user = userEvent.setup()
    render(<ReviewStep />)

    // First attempt - should fail
    const placeOrderButton = screen.getByRole('button', { name: /place order/i })
    await user.click(placeOrderButton)

    await waitFor(() => {
      expect(screen.getByText(/payment error/i)).toBeInTheDocument()
    })

    // Retry - should succeed
    const retryButton = screen.getByRole('button', { name: /retry payment/i })
    await user.click(retryButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/checkout/success')
    })
  })

  it('should show loading state during retry', async () => {
    server.use(
      http.post('/api/payment/authorize', () => {
        return HttpResponse.json(
          { error: 'Payment authorization failed. Please try again.' },
          { status: 500 }
        )
      })
    )

    const user = userEvent.setup()
    render(<ReviewStep />)

    const placeOrderButton = screen.getByRole('button', { name: /place order/i })
    await user.click(placeOrderButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry payment/i })).toBeInTheDocument()
    })

    const retryButton = screen.getByRole('button', { name: /retry payment/i })
    await user.click(retryButton)

    // Should show loading state
    expect(retryButton).toBeDisabled()
  })
})
