import { useState, useEffect } from 'react'
import { useForm } from './useForm'
import { accountSchema, AccountFormData } from '../schemas/accountSchema'
import { useCheckoutStore } from '../store/checkoutStore'
import { useCheckoutNavigation } from '../hooks/useCheckoutNavigation'
import { useValidateEmail } from '../api/queries'
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

export function AccountStep() {
  const { account, setAccount } = useCheckoutStore()
  const { goToNext } = useCheckoutNavigation('account')
  const validateEmail = useValidateEmail()
  
  const [emailError, setEmailError] = useState<string>('')
  const [emailStatus, setEmailStatus] = useState<string>('')

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useForm<AccountFormData>({
      initialValues: account || { email: '', password: '' },
      schema: accountSchema,
      onSubmit: (data) => {
        if(emailError) return
        setAccount(data)
        goToNext()
      },
    })

  const checkEmailAvailability = async (email: string) => {
    setEmailError('')
    setEmailStatus('Checking availability...')
    
    try {
      const result = await validateEmail.mutateAsync(email)
      if (!result.available) {
        setEmailError(result.message)
        setEmailStatus('')
      } else {
        setEmailStatus('Email is available')
      }
    } catch {
      setEmailError('Failed to validate email. Please try again.')
      setEmailStatus('')
    }
  }

  const handleEmailBlur = () => {
    handleBlur('email')
    if (values.email && !errors.email) {
      checkEmailAvailability(values.email)
    }
  }

  const formErrors = Object.entries(errors)
    .filter(([field]) => touched[field as keyof AccountFormData])
    .map(([field, message]) => ({ field, message }))

  if (emailError) {
    formErrors.push({ field: 'email', message: emailError })
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <Stepper steps={steps} currentStep={1} />
      
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>
        Create Account
      </h1>

      <ErrorSummary errors={formErrors} />

      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          label="Email"
          id="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={handleEmailBlur}
          error={touched.email ? errors.email || emailError : undefined}
          helperText={emailStatus}
          autoComplete="email"
        />

        <Input
          type="password"
          label="Password"
          id="password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          error={touched.password ? errors.password : undefined}
          helperText="Must be at least 8 characters with uppercase, lowercase, and number"
          autoComplete="new-password"
        />

        <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
          Continue to Shipping
        </Button>
      </form>
    </div>
  )
}
