import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import { ShippingStep } from '@/features/checkout/pages/ShippingStep'
import { useCheckoutStore } from '@/features/checkout/store/checkoutStore'

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Shipping Quote Integration', () => {
  beforeEach(() => {
    useCheckoutStore.setState({
      account: { email: 'test@example.com', password: 'Password123' },
      shipping: null,
      payment: null,
      orderId: null,
    })
  })

  it('should fetch shipping quote when address is complete', async () => {
    const user = userEvent.setup()
    render(<ShippingStep />)

    // Fill in address
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    await user.type(screen.getByLabelText(/state/i), 'NY')
    await user.type(screen.getByLabelText(/zip code/i), '10001')

    // Tab out of last field to trigger quote fetch
    await user.tab()

    // Wait for shipping options to appear
    await waitFor(() => {
      expect(screen.getByText(/standard shipping/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/express shipping/i)).toBeInTheDocument()
    expect(screen.getByText(/overnight shipping/i)).toBeInTheDocument()
  })

  it('should allow selecting a shipping option', async () => {
    const user = userEvent.setup()
    render(<ShippingStep />)

    // Fill in address
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    await user.type(screen.getByLabelText(/state/i), 'NY')
    await user.type(screen.getByLabelText(/zip code/i), '10001')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/standard shipping/i)).toBeInTheDocument()
    })

    // Select express shipping
    const expressOption = screen.getByRole('radio', { name: /express shipping/i })
    await user.click(expressOption)

    expect(expressOption).toBeChecked()
  })

  it('should update total in store when option selected', async () => {
    const user = userEvent.setup()
    render(<ShippingStep />)

    // Fill in complete address
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'New York')
    await user.type(screen.getByLabelText(/state/i), 'NY')
    await user.type(screen.getByLabelText(/zip code/i), '10001')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/standard shipping/i)).toBeInTheDocument()
    })

    // Select a shipping option
    const standardOption = screen.getByRole('radio', { name: /standard shipping/i })
    await user.click(standardOption)

    // Submit form
    const continueButton = screen.getByRole('button', { name: /continue to payment/i })
    await user.click(continueButton)

    // Check store was updated
    const state = useCheckoutStore.getState()
    expect(state.shipping?.selectedOption).toBe('standard')
  })
})
