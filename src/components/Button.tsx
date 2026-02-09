import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  isLoading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  }

  const variants = {
    primary: {
      backgroundColor: '#4f46e5',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#e5e7eb',
      color: '#374151',
    },
    danger: {
      backgroundColor: '#ef4444',
      color: 'white',
    },
  }

  const disabledStyles = {
    opacity: 0.6,
    cursor: 'not-allowed',
  }

  return (
    <button
      style={{
        ...baseStyles,
        ...variants[variant],
        ...(disabled || isLoading ? disabledStyles : {}),
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="spinner"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            strokeWidth="4"
            stroke="currentColor"
            strokeOpacity="0.25"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            strokeWidth="4"
            stroke="currentColor"
            strokeLinecap="round"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
