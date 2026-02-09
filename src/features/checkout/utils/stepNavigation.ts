export type CheckoutStep = 'account' | 'shipping' | 'payment' | 'review'

export const STEP_PATHS: Record<CheckoutStep, string> = {
  account: '/checkout',
  shipping: '/checkout/shipping',
  payment: '/checkout/payment',
  review: '/checkout/review',
}

export const STEP_ORDER: CheckoutStep[] = [
  'account',
  'shipping',
  'payment',
  'review',
]

export function getNextStep(currentStep: CheckoutStep): CheckoutStep | null {
  const currentIndex = STEP_ORDER.indexOf(currentStep)
  return currentIndex < STEP_ORDER.length - 1
    ? STEP_ORDER[currentIndex + 1]
    : null
}

export function getPrevStep(currentStep: CheckoutStep): CheckoutStep | null {
  const currentIndex = STEP_ORDER.indexOf(currentStep)
  return currentIndex > 0 ? STEP_ORDER[currentIndex - 1] : null
}

export function getStepNumber(step: CheckoutStep): number {
  return STEP_ORDER.indexOf(step) + 1
}
