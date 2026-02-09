interface Step {
  number: number
  label: string
  path: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Checkout progress" style={{ marginBottom: '2rem' }}>
      <ol
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          listStyle: 'none',
          padding: 0,
        }}
      >
        {steps.map((step, index) => {
          const isActive = step.number === currentStep
          const isCompleted = step.number < currentStep
          const isLast = index === steps.length - 1

          return (
            <li
              key={step.number}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <div
                  aria-current={isActive ? 'step' : undefined}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '1rem',
                    backgroundColor: isCompleted
                      ? '#10b981'
                      : isActive
                      ? '#4f46e5'
                      : '#e5e7eb',
                    color: isCompleted || isActive ? 'white' : '#6b7280',
                    border: isActive ? '3px solid #4f46e5' : 'none',
                  }}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <span
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#4f46e5' : '#6b7280',
                    textAlign: 'center',
                  }}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: isCompleted ? '#10b981' : '#e5e7eb',
                    marginTop: '-1.5rem',
                  }}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
