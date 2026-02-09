import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import { AccountStep } from '@/features/checkout/pages/AccountStep'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

// Mock navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe('AccountStep Component', () => {
  it('should render account form', () => {
    render(<AccountStep />)
    
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue to shipping/i })).toBeInTheDocument()
  })

  it('should show validation errors for invalid inputs', async () => {
    const user = userEvent.setup()
    render(<AccountStep />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /continue to shipping/i })

    // Try to submit empty form
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })

  it('should check email availability on blur', async () => {
    const user = userEvent.setup()
    render(<AccountStep />)

    const emailInput = screen.getByLabelText(/email/i)

    await user.type(emailInput, 'test@example.com')
    await user.tab() // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/email is available/i)).toBeInTheDocument()
    })
  })

  it('should show error for taken email', async () => {
    const user = userEvent.setup()
    render(<AccountStep />)

    const emailInput = screen.getByLabelText(/email/i)

    await user.type(emailInput, 'taken@example.com')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/email already in use/i)).toBeInTheDocument()
    })
  })

  it('should show error when email validation fails', async () => {
    // Override handler to return error
    server.use(
      http.post('/api/auth/validate-email', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    const user = userEvent.setup()
    render(<AccountStep />)

    const emailInput = screen.getByLabelText(/email/i)

    await user.type(emailInput, 'test@example.com')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/failed to validate email/i)).toBeInTheDocument()
    })
  })

  it('should validate password requirements', async () => {
    const user = userEvent.setup()
    render(<AccountStep />)

    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(passwordInput, 'weak')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
    })
  })
})
