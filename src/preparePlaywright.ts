import type { BrowserContextOptions, LaunchOptions } from '@playwright/test'
import { chromium } from '@playwright/test'
import { MergedConfig as Config } from './type'
import { getTestCaseFilePath } from './tool'
import { DEFAULT_VIEWPORT } from './constant'

/**
 * playwright record param
 * copy from playwright-core@1.25 source
 */
type EnableRecorderOption = {
  language: string
  launchOptions?: LaunchOptions
  contextOptions?: BrowserContextOptions
  device?: string
  mode?: 'recording' | 'inspecting' // compatible after playwright 1.25
  startRecording?: boolean // compatible before playwright 1.25
  saveStorage?: string
  outputFile?: string
  handleSIGINT?: boolean
}

export const preparePlaywright = async (config: Config) => {
  const { site, outDir, caseName } = config
  const testCaseFile = getTestCaseFilePath(outDir, caseName)
  const browser = await chromium.launch({
    // only for unit test env, use PRAM_HEADLESS env variable
    headless: Boolean(process.env.PRAM_HEADLESS) || false,
    channel: 'chrome',
  })
  const context = await browser.newContext({
    viewport: config.viewport || DEFAULT_VIEWPORT,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (context as any)._enableRecorder({
    language: 'test',
    outputFile: testCaseFile,
    mode: 'recording',
    startRecording: true,
  } as EnableRecorderOption)
  const page = await context.newPage()
  await page.goto(site)
  return { page, browser }
}
