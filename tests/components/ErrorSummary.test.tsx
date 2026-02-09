import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorSummary } from '@/components/ErrorSummary'

describe('ErrorSummary Component', () => {
  it('should not render when no errors', () => {
    const { container } = render(<ErrorSummary errors={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render error list when errors exist', () => {
    const errors = [
      { field: 'email', message: 'Email is required' },
      { field: 'password', message: 'Password is required' },
    ]

    render(<ErrorSummary errors={errors} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  it('should have accessible error summary', () => {
    const errors = [{ field: 'email', message: 'Email is required' }]

    render(<ErrorSummary errors={errors} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
  })

  it('should focus first error field on click', async () => {
    const errors = [{ field: 'email', message: 'Email is required' }]

    // Create a mock input
    const mockInput = document.createElement('input')
    mockInput.id = 'email'
    document.body.appendChild(mockInput)

    const user = userEvent.setup()
    render(<ErrorSummary errors={errors} />)

    const errorLink = screen.getByText(/email is required/i)
    await user.click(errorLink)

    expect(document.activeElement).toBe(mockInput)

    // Cleanup
    document.body.removeChild(mockInput)
  })

  it('should render custom title', () => {
    const errors = [{ field: 'email', message: 'Email is required' }]

    render(<ErrorSummary errors={errors} title="Custom error title" />)

    expect(screen.getByText(/custom error title/i)).toBeInTheDocument()
  })
})
