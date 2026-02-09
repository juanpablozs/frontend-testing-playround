import { z } from 'zod'

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardName: z.string().min(1, 'Cardholder name is required'),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be MM/YY format'),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
})

export type PaymentFormData = z.infer<typeof paymentSchema>
