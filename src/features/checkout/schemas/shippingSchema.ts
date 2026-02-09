import { z } from 'zod'

export const shippingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z
    .string()
    .min(2, 'State is required')
    .max(2, 'State must be 2 characters'),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  selectedOption: z.string().optional(),
})

export type ShippingFormData = z.infer<typeof shippingSchema>
