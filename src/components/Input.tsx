import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 500,
            color: '#374151',
          }}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: error ? '2px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '0.375rem',
            outline: 'none',
          }}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            style={{
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: '#ef4444',
            }}
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={helperId}
            style={{
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
