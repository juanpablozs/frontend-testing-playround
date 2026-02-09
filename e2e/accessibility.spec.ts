import { test, expect } from '@playwright/test'
import AxeBuilder from 'axe-playwright'

test.describe('Accessibility', () => {
  test('account step should not have accessibility violations', async ({ page }) => {
    await page.goto('/checkout')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('review step should not have accessibility violations', async ({ page }) => {
    // Set up complete checkout state
    await page.goto('/checkout')
    
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

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('all form inputs have proper labels', async ({ page }) => {
    await page.goto('/checkout')

    // Check account page
    const emailLabel = await page.locator('label[for="email"]')
    await expect(emailLabel).toBeVisible()
    
    const passwordLabel = await page.locator('label[for="password"]')
    await expect(passwordLabel).toBeVisible()
  })

  test('error messages are announced to screen readers', async ({ page }) => {
    await page.goto('/checkout')

    // Submit empty form
    await page.click('button:has-text("Continue to Shipping")')

    // Error summary should have role="alert"
    const errorSummary = await page.locator('[role="alert"]')
    await expect(errorSummary).toBeVisible()
    
    // Should have aria-live
    await expect(errorSummary).toHaveAttribute('aria-live', 'assertive')
  })

  test('loading states are accessible', async ({ page }) => {
    await page.goto('/checkout')

    await page.fill('input[id="email"]', 'test@example.com')
    
    // Blur to trigger async validation
    await page.locator('input[id="password"]').focus()

    // Loading state should be announced
    const loadingIndicator = await page.locator('[role="status"]')
    
    // Helper text should be visible during check
    await expect(page.getByText(/checking availability/i)).toBeVisible({ timeout: 2000 })
  })

  test('focus is managed correctly on error', async ({ page }) => {
    await page.goto('/checkout')

    // Submit form with errors
    await page.click('button:has-text("Continue to Shipping")')

    // First error field should receive focus
    const focusedElement = await page.evaluate(() => document.activeElement?.id)
    expect(focusedElement).toBe('email')
  })
})
