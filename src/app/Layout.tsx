import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <a
            href="/"
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#4f46e5',
              textDecoration: 'none',
            }}
          >
            Testing Playground
          </a>
          <nav>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              View on GitHub
            </a>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer
        style={{
          marginTop: 'auto',
          padding: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.875rem',
        }}
      >
        <p>
          Built with React, TypeScript, Vitest, Testing Library, and Playwright
        </p>
      </footer>
    </div>
  )
}
