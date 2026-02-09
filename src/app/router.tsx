import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './Layout'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AccountStep } from '@/features/checkout/pages/AccountStep'
import { ShippingStep } from '@/features/checkout/pages/ShippingStep'
import { PaymentStep } from '@/features/checkout/pages/PaymentStep'
import { ReviewStep } from '@/features/checkout/pages/ReviewStep'
import { SuccessPage } from '@/features/checkout/pages/SuccessPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'checkout',
        element: <AccountStep />,
      },
      {
        path: 'checkout/shipping',
        element: <ShippingStep />,
      },
      {
        path: 'checkout/payment',
        element: <PaymentStep />,
      },
      {
        path: 'checkout/review',
        element: <ReviewStep />,
      },
      {
        path: 'checkout/success',
        element: <SuccessPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
