import { useEffect, useRef } from 'react'

interface FieldError {
  field: string
  message: string
}

interface ErrorSummaryProps {
  errors: FieldError[]
  title?: string
}

export function ErrorSummary({
  errors,
  title = 'Please fix the following errors:',
}: ErrorSummaryProps) {
  const summaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (errors.length > 0 && summaryRef.current) {
      summaryRef.current.focus()
      // Focus first invalid input
      const firstErrorField = errors[0]?.field
      if (firstErrorField) {
        const input = document.getElementById(firstErrorField)
        input?.focus()
      }
    }
  }, [errors])

  if (errors.length === 0) return null

  return (
    <div
      ref={summaryRef}
      role="alert"
      aria-live="assertive"
      tabIndex={-1}
      style={{
        backgroundColor: '#fee2e2',
        border: '1px solid #ef4444',
        borderRadius: '0.375rem',
        padding: '1rem',
        marginBottom: '1.5rem',
      }}
    >
      <h2
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: '#991b1b',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h2>
      <ul
        style={{
          listStyle: 'disc',
          paddingLeft: '1.5rem',
        }}
      >
        {errors.map((error, index) => (
          <li
            key={index}
            style={{
              color: '#991b1b',
              marginBottom: '0.25rem',
            }}
          >
            <a
              href={`#${error.field}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(error.field)?.focus()
              }}
              style={{
                color: '#991b1b',
                textDecoration: 'underline',
              }}
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
