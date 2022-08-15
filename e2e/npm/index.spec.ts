import { test, expect } from '@playwright/test'
import { mock } from 'playwright-record-and-mock'
test('test', async ({ page }) => {
  await mock(page, 'npm')
  // Go to https://www.npmjs.com/
  await page.goto('https://www.npmjs.com/') // Click [placeholder="Search packages"]

  await page.locator('[placeholder="Search packages"]').click() // Fill [placeholder="Search packages"]

  await page.locator('[placeholder="Search packages"]').fill('playwright') // Press Enter

  await page.locator('[placeholder="Search packages"]').press('Enter')
  await expect(page).toHaveURL('https://www.npmjs.com/search?q=playwright') // Click text=playwrightexact match >> h3

  await page.locator('text=playwrightexact match >> h3').click()
  await expect(page).toHaveURL('https://www.npmjs.com/package/playwright') // Click text=playwright1.25.0 • Public • Published 4 days ago >> span >> nth=0

  await page.locator('text=playwright1.25.0 • Public • Published 4 days ago >> span').first().click()
  await expect(page).toHaveURL('https://www.npmjs.com/package/playwright')
})
