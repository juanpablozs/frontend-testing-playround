# Frontend Testing Playground 🧪

A production-grade React application showcasing comprehensive frontend testing strategies: unit tests, integration tests, end-to-end tests, API mocking, and CI/CD automation.

![CI](https://github.com/yourusername/frontend-testing-playground/workflows/CI/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Overview](#overview)
- [Demo Application](#demo-application)
- [Testing Strategy](#testing-strategy)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Testing Principles](#testing-principles)
- [MSW Integration](#msw-integration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Key Features](#key-features)
- [Contributing](#contributing)

## 🎯 Overview

This project demonstrates a **realistic, multi-step checkout flow** with comprehensive test coverage across all levels of the testing pyramid. The focus is on **test quality, maintainability, and realistic testing patterns** rather than application complexity.

### What Makes This Special?

- ✅ **100% TypeScript** - Full type safety across app and tests
- 🎭 **MSW for API Mocking** - Same mocks for dev and tests
- 🧪 **Comprehensive Test Suite** - Unit, integration, and E2E tests
- ♿ **Accessibility First** - WCAG 2.1 AA compliant with automated checks
- 🔄 **State Persistence** - LocalStorage + session management
- 🚀 **CI/CD Ready** - GitHub Actions with parallelized jobs
- 📦 **Zero Backend Required** - Fully functional with MSW

## 🛒 Demo Application

A **4-step checkout wizard** that simulates a real e-commerce flow:

1. **Account** - Email validation with async availability check
2. **Shipping** - Address form with dynamic shipping quote API
3. **Payment** - Card details with validation and auth simulation
4. **Review** - Order summary with retry logic for payment failures

### Features Demonstrated

- Async form validation with debouncing
- Error handling and retry patterns
- Loading states and optimistic UI
- Form persistence across page refreshes
- Accessible error summaries with focus management
- Keyboard navigation support

## 🧪 Testing Strategy

### Testing Pyramid Distribution

```
        /\
       /  \        E2E Tests (Playwright)
      /----\       - Happy paths
     /      \      - Error scenarios
    /--------\     - Keyboard navigation
   /          \    - Accessibility
  /------------\   
 /______________\  Integration Tests (Vitest + MSW)
/________________\ - API interactions
                   - State management
                   - Multi-step flows
                   
__________________ Unit Tests (Vitest)
                   - Schema validation
                   - Utilities & formatters
                   - Business logic
```

### Test Coverage by Type

| Test Type | File Count | Purpose | Tools |
|-----------|-----------|---------|-------|
| **Unit** | 3 | Pure functions, schemas, utilities | Vitest |
| **Component** | 3 | Individual components in isolation | Testing Library |
| **Integration** | 2 | Multi-component flows with API | MSW + Testing Library |
| **E2E** | 2 | Full user journeys | Playwright |

### What Each Test Type Covers

#### Unit Tests (`tests/unit/`)

- ✅ Zod schema validation (account, shipping, payment)
- ✅ Currency and card number formatting
- ✅ Step navigation logic (next/prev/numbers)
- ✅ Edge cases and error conditions

```typescript
// Example: Schema validation test
it('should reject password without uppercase', () => {
  const result = accountSchema.safeParse({
    email: 'test@example.com',
    password: 'password123' // Missing uppercase
  })
  expect(result.success).toBe(false)
})
```

#### Component Tests (`tests/components/`)

- ✅ `AccountStep` - Async email validation with MSW
- ✅ `ErrorSummary` - Accessibility and focus management
- ✅ `ShippingOptions` - Radio group interaction

```typescript
// Example: Async validation test
it('should check email availability on blur', async () => {
  const user = userEvent.setup()
  render(<AccountStep />)
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.tab() // Trigger blur
  
  await waitFor(() => {
    expect(screen.getByText(/email is available/i)).toBeVisible()
  })
})
```

#### Integration Tests (`tests/integration/`)

- ✅ Shipping quote fetching and option selection
- ✅ Payment failure and retry flow
- ✅ State updates across components

```typescript
// Example: Payment retry test
it('should succeed on retry after initial failure', async () => {
  // Mock: First call fails, second succeeds
  server.use(mockPaymentFailureThenSuccess)
  
  render(<ReviewStep />)
  
  await user.click(screen.getByRole('button', { name: /place order/i }))
  await waitFor(() => expect(screen.getByText(/payment error/i)).toBeVisible())
  
  await user.click(screen.getByRole('button', { name: /retry payment/i }))
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/checkout/success'))
})
```

#### E2E Tests (`e2e/`)

- ✅ Complete checkout flow (happy path)
- ✅ Payment failure and retry (unhappy path)
- ✅ State persistence on page refresh
- ✅ Keyboard navigation
- ✅ Accessibility with axe-core

```typescript
// Example: E2E happy path
test('complete checkout successfully', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Start Checkout Demo')
  
  // Fill all 4 steps...
  await page.fill('input[id="email"]', 'test@example.com')
  // ... more steps ...
  
  await expect(page).toHaveURL('/checkout/success')
  await expect(page.getByText(/order confirmed/i)).toBeVisible()
})
```

## 🛠 Tech Stack

### Core

- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite 5** - Build tool and dev server
- **React Router 6** - Routing

### State & Data

- **Zustand** - Lightweight state management
- **TanStack Query (React Query)** - Async state and caching
- **Zod** - Schema validation

### Testing

- **Vitest** - Unit and integration test runner
- **Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing
- **MSW (Mock Service Worker)** - API mocking
- **axe-playwright** - Accessibility testing

### Tooling

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/frontend-testing-playground.git
cd frontend-testing-playground

# Install dependencies
npm install

# Initialize MSW
npx msw init public/ --save

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start dev server with MSW mocking
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing

```bash
# Unit & Integration Tests
npm run test         # Run all Vitest tests
npm run test:ui      # Open Vitest UI
npm run test:coverage # Run tests with coverage report

# E2E Tests
npm run e2e          # Run Playwright tests (headless)
npm run e2e:ui       # Open Playwright UI
npm run e2e:headed   # Run tests in headed mode
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript compiler check
```

## 📁 Project Structure

```
frontend-testing-playground/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── e2e/
│   ├── checkout.spec.ts        # E2E happy/unhappy paths
│   └── accessibility.spec.ts   # Accessibility tests
├── src/
│   ├── app/
│   │   ├── App.tsx            # Root component with providers
│   │   ├── Layout.tsx         # App layout shell
│   │   └── router.tsx         # Route definitions
│   ├── components/
│   │   ├── Button.tsx         # Shared button component
│   │   ├── Input.tsx          # Accessible input with validation
│   │   ├── ErrorSummary.tsx   # WCAG-compliant error display
│   │   ├── LoadingSpinner.tsx # Accessible loading state
│   │   └── Stepper.tsx        # Progress indicator
│   ├── features/
│   │   └── checkout/
│   │       ├── components/    # Feature-specific components
│   │       ├── pages/         # Step pages
│   │       ├── hooks/         # Custom hooks
│   │       ├── api/           # API client & queries
│   │       ├── schemas/       # Zod validation schemas
│   │       ├── store/         # Zustand store
│   │       └── utils/         # Helper functions
│   ├── lib/
│   │   ├── queryClient.ts     # React Query config
│   │   ├── storage.ts         # LocalStorage wrapper
│   │   ├── test-utils.tsx     # Testing utilities
│   │   ├── test-setup.ts      # Vitest global setup
│   │   └── msw/
│   │       └── browser.ts     # MSW browser setup
│   ├── mocks/
│   │   ├── handlers.ts        # MSW request handlers
│   │   ├── factories.ts       # Test data factories
│   │   └── server.ts          # MSW server (for tests)
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── NotFoundPage.tsx
│   └── main.tsx               # App entry point
├── tests/
│   ├── unit/
│   │   ├── schemas.test.ts    # Zod schema tests
│   │   ├── formatters.test.ts # Utility function tests
│   │   └── stepNavigation.test.ts
│   ├── components/
│   │   ├── AccountStep.test.tsx
│   │   ├── ErrorSummary.test.tsx
│   │   └── ShippingOptions.test.tsx
│   └── integration/
│       ├── checkout-flow.test.tsx
│       └── payment-retry.test.tsx
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## 🎓 Testing Principles

### 1. Write Tests Users Would Write

```typescript
// ❌ Bad: Testing implementation details
expect(component.state.isOpen).toBe(true)

// ✅ Good: Testing user-visible behavior
expect(screen.getByRole('dialog')).toBeVisible()
```

### 2. Use Stable Selectors

Priority order:
1. `getByRole` - Accessibility-first
2. `getByLabelText` - Form inputs
3. `getByText` - Visible text
4. `getByTestId` - Last resort only

```typescript
// ✅ Preferred
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)

// ⚠️ Avoid
screen.getByTestId('submit-btn')
```

### 3. Test Behavior, Not Implementation

```typescript
// ❌ Bad: Checking internal state
expect(wrapper.find('MyModal').prop('isOpen')).toBe(true)

// ✅ Good: Checking user outcome
expect(screen.getByText(/order confirmed/i)).toBeInTheDocument()
```

### 4. Use Factories for Predictable Data

```typescript
// ✅ Consistent test data
const order = makeOrder({ total: 100 })
const shipping = makeShippingQuote()
```

### 5. Keep Tests Independent

```typescript
// ✅ Each test sets up own state
beforeEach(() => {
  useCheckoutStore.setState({ /* clean state */ })
})
```

## 🎭 MSW Integration

### Why MSW?

Mock Service Worker intercepts network requests at the network level, providing:

- ✅ **Same mocks for dev and tests** - No duplication
- ✅ **No test-specific code in app** - Clean separation
- ✅ **Realistic network behavior** - Delays, errors, timeouts
- ✅ **Type-safe handlers** - Full TypeScript support

### How It Works

```typescript
// 1. Define handlers (src/mocks/handlers.ts)
export const handlers = [
  http.post('/api/auth/validate-email', async ({ request }) => {
    const { email } = await request.json()
    
    if (takenEmails.includes(email)) {
      return HttpResponse.json({ available: false })
    }
    
    return HttpResponse.json({ available: true })
  })
]

// 2. Start in development (src/main.tsx)
if (import.meta.env.MODE === 'development') {
  const { worker } = await import('./lib/msw/browser')
  await worker.start()
}

// 3. Start in tests (src/lib/test-setup.ts)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Configurable Failure Modes

Use query params to simulate errors:

```typescript
// Simulate payment failure
await page.goto('/checkout/review?fail=payment')

// Simulate timeout
await fetch('/api/orders?timeout=true')
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
jobs:
  lint:    # ESLint + TypeScript check
  test:    # Vitest with coverage
  e2e:     # Playwright on Chromium
  build:   # Production build
```

### Features

- ✅ **Parallel jobs** - Lint, test, E2E, build run simultaneously
- ✅ **Dependency caching** - Faster CI with npm cache
- ✅ **Coverage reports** - Uploaded to Codecov
- ✅ **Test artifacts** - Playwright reports saved for 30 days
- ✅ **Build artifacts** - Production bundle saved for 7 days

### Running Locally Like CI

```bash
# Lint
npm run lint && npm run type-check

# Test with coverage
npm run test -- --coverage

# E2E headless
npm run e2e

# Build
npm run build
```

## ✨ Key Features

### 1. Async Email Validation

- Debounced API calls on blur
- Loading state with accessible announcements
- Error handling with retry capability

### 2. Dynamic Shipping Quotes

- Fetches rates based on address
- Updates order total reactively
- Persists selection across navigation

### 3. Payment Retry Pattern

- Simulates transient failures
- User-friendly error messages
- One-click retry with loading state

### 4. State Persistence

- Auto-save to `localStorage` on every change
- Restore on page refresh
- Clear on successful order

### 5. Accessibility

- Semantic HTML with proper ARIA labels
- Keyboard navigation (Tab, Arrow keys, Enter)
- Focus management on errors
- Screen reader announcements (`aria-live`)
- Color contrast WCAG AA compliant

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-test`)
3. Commit your changes (`git commit -m 'Add amazing test pattern'`)
4. Push to the branch (`git push origin feature/amazing-test`)
5. Open a Pull Request

### Testing Guidelines

- All new features must include tests
- Maintain or improve coverage (aim for >80%)
- Follow existing testing patterns
- Use stable, accessible selectors

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Kent C. Dodds for [Testing Library](https://testing-library.com/) best practices
- MSW team for excellent API mocking
- Playwright team for modern E2E testing
- React and TypeScript communities

---

**Built with ❤️ as a learning resource for production-grade frontend testing**

Questions? Issues? [Open an issue](https://github.com/yourusername/frontend-testing-playground/issues)