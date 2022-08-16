import { test, expect } from '@playwright/test'
import { mock } from 'playwright-record-and-mock'
test('test', async ({ page }) => {
  await mock(page, __dirname)
  // Go to https://www.npmjs.com/
  await page.goto('https://www.npmjs.com/') // Click #search div >> nth=1

  await page.locator('#search div').nth(1).click() // Click [placeholder="Search packages"]

  await page.locator('[placeholder="Search packages"]').click() // Fill [placeholder="Search packages"]

  await page.locator('[placeholder="Search packages"]').fill('playwright')
})
