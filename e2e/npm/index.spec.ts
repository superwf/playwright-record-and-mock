import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  // Go to https://www.npmjs.com/
  await page.goto('https://www.npmjs.com/') // Click [placeholder="Search packages"]

  await page.locator('[placeholder="Search packages"]').click() // Fill [placeholder="Search packages"]

  await page.locator('[placeholder="Search packages"]').fill('playwright') // Click text=Build amazing things

  await page.locator('text=Build amazing things').click()
})

