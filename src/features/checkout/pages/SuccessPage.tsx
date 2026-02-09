import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckoutStore } from '../store/checkoutStore'
import { Button } from '@/components/Button'

export function SuccessPage() {
  const navigate = useNavigate()
  const { orderId, reset } = useCheckoutStore()

  useEffect(() => {
    if (!orderId) {
      navigate('/checkout')
    }
  }, [orderId, navigate])

  const handleNewOrder = () => {
    reset()
    navigate('/')
  }

  if (!orderId) return null

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: '#374151',
        }}
      >
        Order Confirmed!
      </h1>

      <p
        style={{
          fontSize: '1.125rem',
          color: '#6b7280',
          marginBottom: '2rem',
        }}
      >
        Thank you for your order. Your order number is:
      </p>

      <div
        style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <p
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
          }}
        >
          Order ID
        </p>
        <p
          style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#4f46e5',
            fontFamily: 'monospace',
          }}
        >
          {orderId}
        </p>
      </div>

      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        You will receive a confirmation email shortly.
      </p>

      <Button onClick={handleNewOrder}>Start New Order</Button>
    </div>
  )
}
