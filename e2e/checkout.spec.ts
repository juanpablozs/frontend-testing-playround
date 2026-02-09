import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test('happy path - complete checkout successfully', async ({ page }) => {
    await page.goto('/')

    // Start checkout
    await page.click('text=Start Checkout Demo')
    await expect(page).toHaveURL('/checkout')

    // Step 1: Account
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
    
    await page.fill('input[id="email"]', 'newuser@example.com')
    await page.fill('input[id="password"]', 'Password123')
    
    // Wait for email validation
    await expect(page.getByText(/email is available/i)).toBeVisible()
    
    await page.click('button:has-text("Continue to Shipping")')
    await expect(page).toHaveURL('/checkout/shipping')

    // Step 2: Shipping
    await page.fill('input[id="first-name"]', 'John')
    await page.fill('input[id="last-name"]', 'Doe')
    await page.fill('input[id="address"]', '123 Main St')
    await page.fill('input[id="city"]', 'New York')
    await page.fill('input[id="state"]', 'NY')
    await page.fill('input[id="zip-code"]', '10001')

    // Wait for shipping options to load
    await expect(page.getByText(/standard shipping/i)).toBeVisible()
    
    // Select shipping option
    await page.click('input[value="standard"]')
    
    await page.click('button:has-text("Continue to Payment")')
    await expect(page).toHaveURL('/checkout/payment')

    // Step 3: Payment
    await page.fill('input[id="card-number"]', '4111111111111111')
    await page.fill('input[id="card-name"]', 'John Doe')
    await page.fill('input[id="expiry-date"]', '1225')
    await page.fill('input[id="cvv"]', '123')

    await page.click('button:has-text("Continue to Review")')
    await expect(page).toHaveURL('/checkout/review')

    // Step 4: Review and Place Order
    await expect(page.getByText(/review order/i)).toBeVisible()
    await expect(page.getByText('newuser@example.com')).toBeVisible()
    await expect(page.getByText(/john doe/i)).toBeVisible()

    await page.click('button:has-text("Place Order")')

    // Success page
    await expect(page).toHaveURL('/checkout/success')
    await expect(page.getByText(/order confirmed/i)).toBeVisible()
    
    // Order ID should be visible
    await expect(page.getByText(/ORD-/i)).toBeVisible()
  })

  test('unhappy path - payment fails then succeeds on retry', async ({ page }) => {
    await page.goto('/checkout')

    // Complete steps 1-3 quickly
    await page.fill('input[id="email"]', 'test@example.com')
    await page.fill('input[id="password"]', 'Password123')
    await page.click('button:has-text("Continue to Shipping")')

    await page.waitForURL('/checkout/shipping')
    await page.fill('input[id="first-name"]', 'John')
    await page.fill('input[id="last-name"]', 'Doe')
    await page.fill('input[id="address"]', '123 Main St')
    await page.fill('input[id="city"]', 'New York')
    await page.fill('input[id="state"]', 'NY')
    await page.fill('input[id="zip-code"]', '10001')
    
    await expect(page.getByText(/standard shipping/i)).toBeVisible()
    await page.click('input[value="standard"]')
    await page.click('button:has-text("Continue to Payment")')

    await page.waitForURL('/checkout/payment')
    await page.fill('input[id="card-number"]', '4111111111111111')
    await page.fill('input[id="card-name"]', 'John Doe')
    await page.fill('input[id="expiry-date"]', '1225')
    await page.fill('input[id="cvv"]', '123')
    await page.click('button:has-text("Continue to Review")')

    await page.waitForURL('/checkout/review')

    // Navigate to review with failure mode
    await page.goto('/checkout/review?fail=payment')

    // Try to place order - should fail
    await page.click('button:has-text("Place Order")')

    // Wait for error message
    await expect(page.getByText(/payment error/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /retry payment/i })).toBeVisible()

    // Remove failure mode and retry
    await page.goto('/checkout/review')
    
    // Click retry (or place order again)
    await page.click('button:has-text("Place Order")')

    // Should succeed
    await expect(page).toHaveURL('/checkout/success', { timeout: 10000 })
  })

  test('URL navigation - refresh mid-checkout restores state', async ({ page }) => {
    await page.goto('/checkout')

    // Fill account step
    await page.fill('input[id="email"]', 'persistent@example.com')
    await page.fill('input[id="password"]', 'Password123')
    await page.click('button:has-text("Continue to Shipping")')

    await page.waitForURL('/checkout/shipping')

    // Fill shipping step
    await page.fill('input[id="first-name"]', 'Jane')
    await page.fill('input[id="last-name"]', 'Smith')
    await page.fill('input[id="address"]', '456 Oak Ave')
    await page.fill('input[id="city"]', 'Boston')
    await page.fill('input[id="state"]', 'MA')
    await page.fill('input[id="zip-code"]', '02101')

    // Reload page
    await page.reload()

    // State should be restored
    await expect(page.locator('input[id="first-name"]')).toHaveValue('Jane')
    await expect(page.locator('input[id="last-name"]')).toHaveValue('Smith')
    await expect(page.locator('input[id="city"]')).toHaveValue('Boston')
  })

  test('keyboard navigation - can navigate through form with keyboard', async ({ page }) => {
    await page.goto('/checkout')

    // Focus email input
    await page.keyboard.press('Tab')
    await page.keyboard.type('keyboard@example.com')
    
    // Tab to password
    await page.keyboard.press('Tab')
    await page.keyboard.type('Password123')

    // Tab to submit button and press Enter
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    // Should navigate to shipping
    await expect(page).toHaveURL('/checkout/shipping')
  })

  test('back navigation works correctly', async ({ page }) => {
    await page.goto('/checkout')

    // Go through to payment step
    await page.fill('input[id="email"]', 'test@example.com')
    await page.fill('input[id="password"]', 'Password123')
    await page.click('button:has-text("Continue to Shipping")')

    await page.waitForURL('/checkout/shipping')
    await page.fill('input[id="first-name"]', 'John')
    await page.fill('input[id="last-name"]', 'Doe')
    await page.fill('input[id="address"]', '123 Main St')
    await page.fill('input[id="city"]', 'New York')
    await page.fill('input[id="state"]', 'NY')
    await page.fill('input[id="zip-code"]', '10001')
    
    await expect(page.getByText(/standard shipping/i)).toBeVisible()
    await page.click('input[value="standard"]')
    await page.click('button:has-text("Continue to Payment")')

    await page.waitForURL('/checkout/payment')

    // Click back button
    await page.click('button:has-text("Back")')

    // Should be on shipping page
    await expect(page).toHaveURL('/checkout/shipping')
  })
})
