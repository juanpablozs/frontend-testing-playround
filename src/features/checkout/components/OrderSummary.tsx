import { useCheckoutStore } from '../store/checkoutStore'
import { formatCurrency, maskCardNumber } from '../utils/formatters'

interface OrderSummaryProps {
  shippingCost?: number
  showPayment?: boolean
}

export function OrderSummary({
  shippingCost = 0,
  showPayment = false,
}: OrderSummaryProps) {
  const { account, shipping, payment } = useCheckoutStore()

  const subtotal = 100.0
  const total = subtotal + shippingCost

  return (
    <div
      style={{
        backgroundColor: '#f9fafb',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
      }}
    >
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          marginBottom: '1rem',
          color: '#374151',
        }}
      >
        Order Summary
      </h3>

      {account && (
        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Account</div>
          <div style={{ fontWeight: 500 }}>{account.email}</div>
        </div>
      )}

      {shipping && (
        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Ship to
          </div>
          <div style={{ fontWeight: 500 }}>
            {shipping.firstName} {shipping.lastName}
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            {shipping.address}
            <br />
            {shipping.city}, {shipping.state} {shipping.zipCode}
          </div>
        </div>
      )}

      {showPayment && payment && (
        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Payment
          </div>
          <div style={{ fontWeight: 500 }}>{maskCardNumber(payment.cardNumber)}</div>
          <div style={{ fontSize: '0.875rem' }}>{payment.cardName}</div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
        }}
      >
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      {shippingCost > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <span>Shipping</span>
          <span>{formatCurrency(shippingCost)}</span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          marginTop: '1rem',
          borderTop: '2px solid #e5e7eb',
          fontSize: '1.25rem',
          fontWeight: 600,
        }}
      >
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
