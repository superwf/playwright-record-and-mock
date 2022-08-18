import { test, expect } from '@playwright/test'
import { mock } from 'playwright-record-and-mock'
test('test', async ({ page }) => {
  await mock(page, __dirname)
  // Go to https://www.npmjs.com/
  await page.goto('https://www.npmjs.com/') // Click [placeholder="Search packages"]

  await page.locator('[placeholder="Search packages"]').click() // Fill [placeholder="Search packages"]

  await page.locator('[placeholder="Search packages"]').fill('playwright-record') // Click text=playwright-record-and-mock

  await page.locator('text=playwright-record-and-mock').click()
  await expect(page).toHaveURL('https://www.npmjs.com/package/playwright-record-and-mock')
})
