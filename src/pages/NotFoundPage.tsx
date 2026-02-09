import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'

export function NotFoundPage() {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '6rem',
          fontWeight: 700,
          color: '#d1d5db',
          marginBottom: '0',
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: '2rem',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '1rem',
        }}
      >
        Page Not Found
      </h2>

      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        The page you're looking for doesn't exist.
      </p>

      <Link to="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  )
}
