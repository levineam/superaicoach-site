import { test, expect } from '@playwright/test'

/**
 * Project Board E2E tests
 *
 * Tests the 3-lane kanban board at /mission-control/[tenant]/project-board.
 *
 * Prerequisites:
 *   - Set E2E_EMAIL, E2E_PASSWORD, and E2E_TENANT_SLUG env vars
 *   - Or: npx playwright codegen https://superaicoach.com/sign-in --save-storage=e2e/auth.json
 */

const TENANT = process.env.E2E_TENANT_SLUG || 'andrew'
const BOARD_URL = `/mission-control/${TENANT}/project-board`

async function ensureSignedIn(page: import('@playwright/test').Page) {
  if (page.url().includes('/sign-in')) {
    const email = process.env.E2E_EMAIL
    const password = process.env.E2E_PASSWORD
    if (!email || !password) {
      test.skip(true, 'E2E_EMAIL / E2E_PASSWORD not set — skipping auth-required test')
      return
    }
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/mission-control/, { timeout: 10_000 })
  }
}

test.describe('Project Board', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BOARD_URL)
    await ensureSignedIn(page)
  })

  test('renders all three lane headers', async ({ page }) => {
    // The board renders Queue, Needs You, and Done lanes
    await expect(page.getByText('Queue', { exact: true })).toBeVisible()
    await expect(page.getByText('Needs You', { exact: true })).toBeVisible()
    await expect(page.getByText('Done', { exact: true })).toBeVisible()
  })

  test('project filter dropdown is present and defaults to All Projects', async ({ page }) => {
    const select = page.locator('#project-filter')
    await expect(select).toBeVisible()
    await expect(select).toHaveValue('__all__')
  })

  test('refresh button triggers board reload', async ({ page }) => {
    const refreshBtn = page.getByRole('button', { name: /Refresh/i })
    await expect(refreshBtn).toBeVisible()
    // Click refresh — board should re-render without error
    await refreshBtn.click()
    // After reload, lane headers should still be visible
    await expect(page.getByText('Queue', { exact: true })).toBeVisible()
  })

  test('task card opens modal on click when cards are present', async ({ page }) => {
    // Only runs if the board has at least one card
    const cards = page.locator('button.text-left')
    const count = await cards.count()
    if (count === 0) {
      test.skip(true, 'No cards in board — skipping modal test')
      return
    }
    await cards.first().click()
    // Modal should appear with aria-modal attribute
    await expect(page.locator('[aria-modal="true"]')).toBeVisible()
    // Pressing Escape closes the modal
    await page.keyboard.press('Escape')
    await expect(page.locator('[aria-modal="true"]')).not.toBeVisible()
  })
})
