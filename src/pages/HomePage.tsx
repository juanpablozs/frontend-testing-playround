import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'

export function HomePage() {
  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: '#374151',
        }}
      >
        Frontend Testing Playground
      </h1>

      <p
        style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem',
        }}
      >
        A production-grade React application showcasing comprehensive testing
        strategies: unit tests, integration tests, E2E tests, and API mocking
        with MSW.
      </p>

      <Link to="/checkout">
        <Button>Start Checkout Demo</Button>
      </Link>

      <div
        style={{
          marginTop: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'left',
        }}
      >
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            🧪 Testing
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Vitest, Testing Library, Playwright
          </p>
        </div>

        <div>
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            🎭 API Mocking
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            MSW for dev & test environments
          </p>
        </div>

        <div>
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            ♿ Accessibility
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            ARIA labels, keyboard navigation
          </p>
        </div>

        <div>
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>⚡ CI/CD</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            GitHub Actions automation
          </p>
        </div>
      </div>
    </div>
  )
}
