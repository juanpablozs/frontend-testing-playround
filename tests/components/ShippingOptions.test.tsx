import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShippingOptions } from '@/features/checkout/components/ShippingOptions'
import { makeShippingQuote } from '@/mocks/factories'

describe('ShippingOptions Component', () => {
  const mockOptions = makeShippingQuote()
  const mockOnSelect = vi.fn()

  it('should render all shipping options', () => {
    render(
      <ShippingOptions
        options={mockOptions}
        onSelect={mockOnSelect}
      />
    )

    expect(screen.getByText(/standard shipping/i)).toBeInTheDocument()
    expect(screen.getByText(/express shipping/i)).toBeInTheDocument()
    expect(screen.getByText(/overnight shipping/i)).toBeInTheDocument()
  })

  it('should show prices for all options', () => {
    render(
      <ShippingOptions
        options={mockOptions}
        onSelect={mockOnSelect}
      />
    )

    expect(screen.getByText('$5.99')).toBeInTheDocument()
    expect(screen.getByText('$12.99')).toBeInTheDocument()
    expect(screen.getByText('$24.99')).toBeInTheDocument()
  })

  it('should call onSelect when option is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ShippingOptions
        options={mockOptions}
        onSelect={mockOnSelect}
      />
    )

    const standardOption = screen.getByLabelText(/standard shipping/i)
    await user.click(standardOption)

    expect(mockOnSelect).toHaveBeenCalledWith('standard')
  })

  it('should show selected option', () => {
    render(
      <ShippingOptions
        options={mockOptions}
        selectedOption="express"
        onSelect={mockOnSelect}
      />
    )

    const expressRadio = screen.getByRole('radio', { name: /express shipping/i })
    expect(expressRadio).toBeChecked()
  })

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup()
    render(
      <ShippingOptions
        options={mockOptions}
        onSelect={mockOnSelect}
      />
    )

    const firstRadio = screen.getAllByRole('radio')[0]
    firstRadio?.focus()
    
    expect(firstRadio).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    const secondRadio = screen.getAllByRole('radio')[1]
    expect(secondRadio).toHaveFocus()
  })
})
