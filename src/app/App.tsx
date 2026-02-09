import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { AppRouter } from './router'
import { useCheckoutPersistence } from '@/features/checkout/hooks/useCheckoutPersistence'

function AppProviders({ children }: { children: React.ReactNode }) {
  useCheckoutPersistence()
  return <>{children}</>
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </QueryClientProvider>
  )
}
