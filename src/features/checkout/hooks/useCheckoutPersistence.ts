import { useEffect } from 'react'
import { useCheckoutStore } from '../store/checkoutStore'
import { checkoutStorage } from '@/lib/storage'

export function useCheckoutPersistence() {
  const state = useCheckoutStore()

  // Load from localStorage on mount
  useEffect(() => {
    const saved = checkoutStorage.get()
    if (saved && typeof saved === 'object') {
      const data = saved as {
        account?: unknown
        shipping?: unknown
        payment?: unknown
      }
      if (data.account) state.setAccount(data.account as never)
      if (data.shipping) state.setShipping(data.shipping as never)
      if (data.payment) state.setPayment(data.payment as never)
    }
  }, [])

  // Save to localStorage on every state change
  useEffect(() => {
    checkoutStorage.set({
      account: state.account,
      shipping: state.shipping,
      payment: state.payment,
    })
  }, [state.account, state.shipping, state.payment])

  return {
    clearPersistedData: checkoutStorage.clear,
  }
}
