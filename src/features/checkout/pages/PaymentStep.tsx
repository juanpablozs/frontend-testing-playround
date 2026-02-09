import { useForm } from './useForm'
import { paymentSchema, PaymentFormData } from '../schemas/paymentSchema'
import { useCheckoutStore } from '../store/checkoutStore'
import { useCheckoutNavigation } from '../hooks/useCheckoutNavigation'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { ErrorSummary } from '@/components/ErrorSummary'
import { Stepper } from '@/components/Stepper'

const steps = [
  { number: 1, label: 'Account', path: '/checkout' },
  { number: 2, label: 'Shipping', path: '/checkout/shipping' },
  { number: 3, label: 'Payment', path: '/checkout/payment' },
  { number: 4, label: 'Review', path: '/checkout/review' },
]

export function PaymentStep() {
  const { payment, setPayment } = useCheckoutStore()
  const { goToNext, goToPrev } = useCheckoutNavigation('payment')

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useForm<PaymentFormData>({
      initialValues: payment || {
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
      },
      schema: paymentSchema,
      onSubmit: (data) => {
        setPayment(data)
        goToNext()
      },
    })

  const handleCardNumberChange = (value: string) => {
    // Remove non-digits
    const cleaned = value.replace(/\D/g, '')
    handleChange('cardNumber', cleaned)
  }

  const handleExpiryChange = (value: string) => {
    // Auto-format MM/YY
    const cleaned = value.replace(/\D/g, '')
    let formatted = cleaned
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    handleChange('expiryDate', formatted)
  }

  const formErrors = Object.entries(errors)
    .filter(([field]) => touched[field as keyof PaymentFormData])
    .map(([field, message]) => ({ field, message }))

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <Stepper steps={steps} currentStep={3} />
      
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>
        Payment Information
      </h1>

      <ErrorSummary errors={formErrors} />

      <form onSubmit={handleSubmit}>
        <Input
          label="Card Number"
          id="card-number"
          type="text"
          inputMode="numeric"
          value={values.cardNumber}
          onChange={(e) => handleCardNumberChange(e.target.value)}
          onBlur={() => handleBlur('cardNumber')}
          error={touched.cardNumber ? errors.cardNumber : undefined}
          maxLength={16}
          placeholder="1234567812345678"
          autoComplete="off"
        />

        <Input
          label="Cardholder Name"
          id="card-name"
          value={values.cardName}
          onChange={(e) => handleChange('cardName', e.target.value)}
          onBlur={() => handleBlur('cardName')}
          error={touched.cardName ? errors.cardName : undefined}
          autoComplete="name"
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Expiry Date"
            id="expiry-date"
            type="text"
            inputMode="numeric"
            value={values.expiryDate}
            onChange={(e) => handleExpiryChange(e.target.value)}
            onBlur={() => handleBlur('expiryDate')}
            error={touched.expiryDate ? errors.expiryDate : undefined}
            placeholder="MM/YY"
            maxLength={5}
            autoComplete="off"
          />

          <Input
            label="CVV"
            id="cvv"
            type="text"
            inputMode="numeric"
            value={values.cvv}
            onChange={(e) => handleChange('cvv', e.target.value.replace(/\D/g, ''))}
            onBlur={() => handleBlur('cvv')}
            error={touched.cvv ? errors.cvv : undefined}
            maxLength={4}
            autoComplete="off"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Button type="button" variant="secondary" onClick={goToPrev}>
            Back
          </Button>
          <Button type="submit" style={{ flex: 1 }}>
            Continue to Review
          </Button>
        </div>
      </form>
    </div>
  )
}
