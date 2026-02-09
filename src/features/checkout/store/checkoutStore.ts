import { create } from 'zustand'
import { AccountFormData } from '../schemas/accountSchema'
import { ShippingFormData } from '../schemas/shippingSchema'
import { PaymentFormData } from '../schemas/paymentSchema'

interface CheckoutState {
  account: AccountFormData | null
  shipping: ShippingFormData | null
  payment: PaymentFormData | null
  orderId: string | null
  setAccount: (data: AccountFormData) => void
  setShipping: (data: ShippingFormData) => void
  setPayment: (data: PaymentFormData) => void
  setOrderId: (id: string) => void
  reset: () => void
  getState: () => CheckoutState
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  account: null,
  shipping: null,
  payment: null,
  orderId: null,
  setAccount: (data) => set({ account: data }),
  setShipping: (data) => set({ shipping: data }),
  setPayment: (data) => set({ payment: data }),
  setOrderId: (id) => set({ orderId: id }),
  reset: () => set({ account: null, shipping: null, payment: null, orderId: null }),
  getState: () => get(),
}))
