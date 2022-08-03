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

  // Go to https://www.npmjs.com/package/playwright
  await page.goto('https://www.npmjs.com/package/playwright')

  // Click img[alt="TypeScript icon\, indicating that this package has built-in type declarations"]
  await page
    .locator('img[alt="TypeScript icon\\, indicating that this package has built-in type declarations"]')
    .click()
})

