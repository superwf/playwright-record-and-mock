import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  projects: [
    {
      name: 'Chrome Stable',
      testDir: 'e2e',
      use: {
        headless: false,
        browserName: 'chromium',
        channel: 'chrome',
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
}
export default config
