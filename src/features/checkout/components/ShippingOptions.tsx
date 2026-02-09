import { ShippingOption } from '../api/checkoutApi'
import { formatCurrency } from '../utils/formatters'

interface ShippingOptionsProps {
  options: ShippingOption[]
  selectedOption?: string
  onSelect: (optionId: string) => void
}

export function ShippingOptions({
  options,
  selectedOption,
  onSelect,
}: ShippingOptionsProps) {
  return (
    <fieldset style={{ border: 'none', padding: 0 }}>
      <legend
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          marginBottom: '1rem',
          color: '#374151',
        }}
      >
        Select Shipping Method
      </legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {options.map((option) => {
          const isSelected = selectedOption === option.id
          return (
            <label
              key={option.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: isSelected ? '2px solid #4f46e5' : '1px solid #d1d5db',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#eef2ff' : 'white',
                transition: 'all 0.2s',
              }}
            >
              <input
                type="radio"
                name="shipping-option"
                value={option.id}
                checked={isSelected}
                onChange={() => onSelect(option.id)}
                style={{
                  marginRight: '1rem',
                  width: '1.25rem',
                  height: '1.25rem',
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#374151' }}>
                  {option.name}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {option.estimatedDays}
                </div>
              </div>
              <div style={{ fontWeight: 600, color: '#374151' }}>
                {formatCurrency(option.price)}
              </div>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
