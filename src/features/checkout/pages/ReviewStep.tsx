import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckoutStore } from '../store/checkoutStore'
import { useCheckoutNavigation } from '../hooks/useCheckoutNavigation'
import { usePaymentAuth, useCreateOrder } from '../api/queries'
import { Button } from '@/components/Button'
import { Stepper } from '@/components/Stepper'
import { OrderSummary } from '../components/OrderSummary'

const steps = [
  { number: 1, label: 'Account', path: '/checkout' },
  { number: 2, label: 'Shipping', path: '/checkout/shipping' },
  { number: 3, label: 'Payment', path: '/checkout/payment' },
  { number: 4, label: 'Review', path: '/checkout/review' },
]

export function ReviewStep() {
  const navigate = useNavigate()
  const { shipping, payment, setOrderId } = useCheckoutStore()
  const { goToPrev } = useCheckoutNavigation('review')
  const paymentAuth = usePaymentAuth()
  const createOrder = useCreateOrder()
  
  const [error, setError] = useState<string>('')

  const shippingCost = shipping?.selectedOption === 'overnight' ? 24.99 :
                       shipping?.selectedOption === 'express' ? 12.99 : 5.99

  const handlePlaceOrder = async () => {
    setError('')
    
    try {
      // Authorize payment
      await paymentAuth.mutateAsync(payment)
      
      // Create order
      const order = await createOrder.mutateAsync({
        shipping,
        payment,
        shippingCost,
      })
      
      setOrderId(order.orderId)
      navigate('/checkout/success')
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to place order. Please try again.'
      )
    }
  }

  const handleRetry = () => {
    handlePlaceOrder()
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Stepper steps={steps} currentStep={4} />
      
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>
        Review Order
      </h1>

      {error && (
        <div
          role="alert"
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '0.375rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#991b1b',
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            Payment Error
          </p>
          <p>{error}</p>
          <Button
            variant="danger"
            onClick={handleRetry}
            style={{ marginTop: '1rem' }}
            isLoading={paymentAuth.isPending || createOrder.isPending}
          >
            Retry Payment
          </Button>
        </div>
      )}

      <OrderSummary shippingCost={shippingCost} showPayment={true} />

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Button type="button" variant="secondary" onClick={goToPrev}>
          Back
        </Button>
        <Button
          onClick={handlePlaceOrder}
          isLoading={paymentAuth.isPending || createOrder.isPending}
          style={{ flex: 1 }}
        >
          Place Order
        </Button>
      </div>
    </div>
  )
}
