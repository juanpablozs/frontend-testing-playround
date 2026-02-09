import { getStepNumber } from '../utils/stepNavigation'

interface StepIndicatorProps {
  currentPath: string
}

export function StepIndicator({ currentPath }: StepIndicatorProps) {
  const getCurrentStep = () => {
    if (currentPath.includes('/shipping')) return 2
    if (currentPath.includes('/payment')) return 3
    if (currentPath.includes('/review')) return 4
    return 1
  }

  const currentStep = getCurrentStep()

  return (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '1rem',
        color: '#6b7280',
        fontSize: '0.875rem',
      }}
    >
      Step {currentStep} of 4
    </div>
  )
}
