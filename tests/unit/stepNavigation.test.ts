import { describe, it, expect } from 'vitest'
import {
  getNextStep,
  getPrevStep,
  getStepNumber,
  STEP_PATHS,
  STEP_ORDER,
} from '@/features/checkout/utils/stepNavigation'

describe('Step Navigation', () => {
  describe('getNextStep', () => {
    it('should return next step for account', () => {
      expect(getNextStep('account')).toBe('shipping')
    })

    it('should return next step for shipping', () => {
      expect(getNextStep('shipping')).toBe('payment')
    })

    it('should return next step for payment', () => {
      expect(getNextStep('payment')).toBe('review')
    })

    it('should return null for last step', () => {
      expect(getNextStep('review')).toBe(null)
    })
  })

  describe('getPrevStep', () => {
    it('should return null for first step', () => {
      expect(getPrevStep('account')).toBe(null)
    })

    it('should return prev step for shipping', () => {
      expect(getPrevStep('shipping')).toBe('account')
    })

    it('should return prev step for payment', () => {
      expect(getPrevStep('payment')).toBe('shipping')
    })

    it('should return prev step for review', () => {
      expect(getPrevStep('review')).toBe('payment')
    })
  })

  describe('getStepNumber', () => {
    it('should return correct step numbers', () => {
      expect(getStepNumber('account')).toBe(1)
      expect(getStepNumber('shipping')).toBe(2)
      expect(getStepNumber('payment')).toBe(3)
      expect(getStepNumber('review')).toBe(4)
    })
  })

  describe('STEP_PATHS', () => {
    it('should have correct paths for all steps', () => {
      expect(STEP_PATHS.account).toBe('/checkout')
      expect(STEP_PATHS.shipping).toBe('/checkout/shipping')
      expect(STEP_PATHS.payment).toBe('/checkout/payment')
      expect(STEP_PATHS.review).toBe('/checkout/review')
    })
  })

  describe('STEP_ORDER', () => {
    it('should have all steps in correct order', () => {
      expect(STEP_ORDER).toEqual(['account', 'shipping', 'payment', 'review'])
    })
  })
})
