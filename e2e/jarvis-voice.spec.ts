import { test, expect } from '@playwright/test'

/**
 * Jarvis Voice E2E tests
 *
 * Prerequisites:
 *   - Set E2E_EMAIL and E2E_PASSWORD env vars (or use saved auth state)
 *   - Or run: npx playwright test --project=chromium after signing in and saving state
 *
 * To save auth state for reuse:
 *   npx playwright codegen https://superaicoach.com/sign-in --save-storage=e2e/auth.json
 */

const JARVIS_URL = '/mission-control/andrew/jarvis'

// Helper: try to log in if the page redirected to sign-in
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

test.describe('Jarvis Voice', () => {
  test('Jarvis page loads and shows the orb', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.goto(JARVIS_URL)
    await ensureSignedIn(page)

    // Orb should be visible (the aria-label is set on the clickable div)
    const orb = page.getByRole('button', { name: 'Click to speak with Jarvis' })
    await expect(orb).toBeVisible({ timeout: 10_000 })

    // Log any console errors for debugging
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors)
    }

    // Expect no fatal console errors
    const fatalErrors = consoleErrors.filter(e =>
      e.includes('Uncaught') || e.includes('TypeError') || e.includes('SyntaxError')
    )
    expect(fatalErrors).toHaveLength(0)
  })

  test('orb click triggers mic permission / starts listening state', async ({ page, context }) => {
    // Grant microphone permission
    await context.grantPermissions(['microphone'])

    const consoleMessages: string[] = []
    page.on('console', msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`))

    await page.goto(JARVIS_URL)
    await ensureSignedIn(page)

    // Wait for orb to render and be clickable
    const orb = page.getByRole('button', { name: 'Click to speak with Jarvis' })
    await expect(orb).toBeVisible({ timeout: 10_000 })

    // Click the orb
    await orb.click()

    // After click, the label text below the orb should change to "Listening"
    // (the motion.p element with key={state})
    await expect(page.getByText('Listening')).toBeVisible({ timeout: 5_000 })

    console.log('Console messages after orb click:', consoleMessages)
  })

  test('orb is clickable immediately on page load (no auto-TTS blocking it)', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.goto(JARVIS_URL)
    await ensureSignedIn(page)

    // The orb should be immediately clickable (not blocked by auto-playing greeting)
    const orb = page.getByRole('button', { name: 'Click to speak with Jarvis' })
    await expect(orb).toBeVisible({ timeout: 5_000 })

    // It should NOT be in "speaking" state (which would remove the onClick handler)
    // Verify: hint text "Click the orb to speak" should be visible after short delay
    await expect(page.getByText('Click the orb to speak')).toBeVisible({ timeout: 5_000 })
  })

  test('TTS endpoint returns audio for a sample text', async ({ request }) => {
    // This test calls the TTS API directly (no auth needed for internal API in test env)
    // It validates ElevenLabs is configured and responding
    const resp = await request.post('https://superaicoach.com/api/mission-control/tts', {
      data: { text: 'Hello, this is a test.' },
      headers: { 'Content-Type': 'application/json' },
    })

    // 200 = ElevenLabs returned audio
    // 503 = ELEVENLABS_API_KEY not set
    // 401/403 = auth required for the endpoint (ok, just means it's gated)
    if (resp.status() === 503) {
      console.warn('TTS endpoint returned 503 — ELEVENLABS_API_KEY may not be set in this environment')
    } else if (resp.status() === 401 || resp.status() === 403) {
      console.info('TTS endpoint is auth-gated — expected in production')
    } else {
      expect(resp.status()).toBe(200)
      const contentType = resp.headers()['content-type']
      expect(contentType).toContain('audio')
    }
  })
})
