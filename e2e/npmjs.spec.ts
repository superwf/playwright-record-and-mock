import { test, expect } from '@playwright/test'
import { factory } from '../src/factory'

const { record, mock } = factory({
  mockFilePath: 'fixture/npmjs.json',
  urlMatcher: /\/search\//,
})
record()

test.use({
  viewport: {
    height: 1080,
    width: 1920,
  },
})

test('test', async ({ page }) => {
  mock(page)

  // Go to https://www.npmjs.com/
  await page.goto('https://www.npmjs.com/')

  // Click [placeholder="Search packages"]
  await page.locator('[placeholder="Search packages"]').click()

  // Fill [placeholder="Search packages"]
  await page.locator('[placeholder="Search packages"]').fill('playwright')

  // Click text=playwrightA high-level API to automate web browsers >> strong
  await page.locator('text=playwrightA high-level API to automate web browsers >> strong').click()

  // Click button:has-text("Search")
  await page.locator('button:has-text("Search")').click()
  await expect(page).toHaveURL('https://www.npmjs.com/search?q=playwright')

  // Click text=playwrightexact match >> h3
  await page.locator('text=playwrightexact match >> h3').click()
  await expect(page).toHaveURL('https://www.npmjs.com/package/playwright')

  // Click img[alt="TypeScript icon\, indicating that this package has built-in type declarations"]
  await page
    .locator('img[alt="TypeScript icon\\, indicating that this package has built-in type declarations"]')
    .click()
})
