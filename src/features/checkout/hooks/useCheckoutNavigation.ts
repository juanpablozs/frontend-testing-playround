import { useNavigate } from 'react-router-dom'
import {
  CheckoutStep,
  getNextStep,
  getPrevStep,
  STEP_PATHS,
} from '../utils/stepNavigation'

export function useCheckoutNavigation(currentStep: CheckoutStep) {
  const navigate = useNavigate()

  const goToNext = () => {
    const next = getNextStep(currentStep)
    if (next) {
      navigate(STEP_PATHS[next])
    }
  }

  const goToPrev = () => {
    const prev = getPrevStep(currentStep)
    if (prev) {
      navigate(STEP_PATHS[prev])
    }
  }

  const goToStep = (step: CheckoutStep) => {
    navigate(STEP_PATHS[step])
  }

  return {
    goToNext,
    goToPrev,
    goToStep,
    hasNext: getNextStep(currentStep) !== null,
    hasPrev: getPrevStep(currentStep) !== null,
  }
}
