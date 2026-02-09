import { useState, useEffect } from 'react'
import { useForm } from './useForm'
import { shippingSchema, ShippingFormData } from '../schemas/shippingSchema'
import { useCheckoutStore } from '../store/checkoutStore'
import { useCheckoutNavigation } from '../hooks/useCheckoutNavigation'
import { useShippingQuote } from '../api/queries'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { ErrorSummary } from '@/components/ErrorSummary'
import { Stepper } from '@/components/Stepper'
import { ShippingOptions } from '../components/ShippingOptions'
import { ShippingOption } from '../api/checkoutApi'

const steps = [
  { number: 1, label: 'Account', path: '/checkout' },
  { number: 2, label: 'Shipping', path: '/checkout/shipping' },
  { number: 3, label: 'Payment', path: '/checkout/payment' },
  { number: 4, label: 'Review', path: '/checkout/review' },
]

export function ShippingStep() {
  const { shipping, setShipping } = useCheckoutStore()
  const { goToNext, goToPrev } = useCheckoutNavigation('shipping')
  const shippingQuote = useShippingQuote()
  
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useForm<ShippingFormData>({
      initialValues: shipping || {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
      schema: shippingSchema,
      onSubmit: (data) => {
        if (!selectedOption) return
        setShipping({ ...data, selectedOption })
        goToNext()
      },
    })

  // Fetch shipping quote when address is complete
  useEffect(() => {
    const hasAddress = values.address && values.city && values.state && values.zipCode
    if (hasAddress && !errors.address && !errors.city && !errors.state && !errors.zipCode) {
      fetchShippingQuote()
    }
  }, [values.address, values.city, values.state, values.zipCode])

  const fetchShippingQuote = async () => {
    try {
      const result = await shippingQuote.mutateAsync(values)
      setShippingOptions(result.options)
      if (shipping?.selectedOption) {
        setSelectedOption(shipping.selectedOption)
      }
    } catch (error) {
      console.error('Failed to fetch shipping quote:', error)
    }
  }

  const formErrors = Object.entries(errors)
    .filter(([field]) => touched[field as keyof ShippingFormData])
    .map(([field, message]) => ({ field, message }))

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Stepper steps={steps} currentStep={2} />
      
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>
        Shipping Information
      </h1>

      <ErrorSummary errors={formErrors} />

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="First Name"
            id="first-name"
            value={values.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            error={touched.firstName ? errors.firstName : undefined}
            autoComplete="given-name"
          />

          <Input
            label="Last Name"
            id="last-name"
            value={values.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            error={touched.lastName ? errors.lastName : undefined}
            autoComplete="family-name"
          />
        </div>

        <Input
          label="Address"
          id="address"
          value={values.address}
          onChange={(e) => handleChange('address', e.target.value)}
          onBlur={() => handleBlur('address')}
          error={touched.address ? errors.address : undefined}
          autoComplete="street-address"
        />

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <Input
            label="City"
            id="city"
            value={values.city}
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
            error={touched.city ? errors.city : undefined}
            autoComplete="address-level2"
          />

          <Input
            label="State"
            id="state"
            value={values.state}
            onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
            onBlur={() => handleBlur('state')}
            error={touched.state ? errors.state : undefined}
            maxLength={2}
            placeholder="NY"
            autoComplete="address-level1"
          />

          <Input
            label="ZIP Code"
            id="zip-code"
            value={values.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            onBlur={() => handleBlur('zipCode')}
            error={touched.zipCode ? errors.zipCode : undefined}
            autoComplete="postal-code"
          />
        </div>

        {shippingQuote.isPending && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            Loading shipping options...
          </div>
        )}

        {shippingOptions.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <ShippingOptions
              options={shippingOptions}
              selectedOption={selectedOption}
              onSelect={setSelectedOption}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Button type="button" variant="secondary" onClick={goToPrev}>
            Back
          </Button>
          <Button
            type="submit"
            disabled={!selectedOption}
            style={{ flex: 1 }}
          >
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  )
}
