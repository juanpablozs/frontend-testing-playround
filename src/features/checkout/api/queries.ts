import { useMutation, useQuery } from '@tanstack/react-query'
import { checkoutApi } from './checkoutApi'

export function useValidateEmail() {
  return useMutation({
    mutationFn: (email: string) => checkoutApi.validateEmail(email),
  })
}

export function useShippingQuote() {
  return useMutation({
    mutationFn: (address: unknown) => checkoutApi.getShippingQuote(address),
  })
}

export function usePaymentAuth() {
  return useMutation({
    mutationFn: (paymentData: unknown) =>
      checkoutApi.authorizePayment(paymentData),
  })
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (orderData: unknown) => checkoutApi.createOrder(orderData),
  })
}

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: () => checkoutApi.getSession(),
    staleTime: Infinity,
  })
}
