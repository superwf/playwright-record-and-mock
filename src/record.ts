import { join } from 'path'
import { ensureDir } from 'fs-extra'
import type { BrowserContextOptions, LaunchOptions } from '@playwright/test'
import { chromium } from '@playwright/test'
import { Config } from './type'
import { resolveRoot, getTestCaseFilePath } from './tool'
import { recordAllInOneFixture } from './recordAllInOneFixture'
import { recordFixtures } from './recordFixtures'
import { FIXTURES_DIR } from './constant'

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

export const record = async (config: Config) => {
  const { site, outDir, caseName, shouldRecordOneFixture } = config
  await ensureDir(resolveRoot(join(outDir, caseName)))
  if (!shouldRecordOneFixture) {
    await ensureDir(resolveRoot(join(outDir, caseName, FIXTURES_DIR)))
  }
  const testCaseFile = getTestCaseFilePath(outDir, caseName)
  const browser = await chromium.launch({
    // for unit test env, use PLAYWRIGHT_HEADLESS env variable
    headless: Boolean(process.env.PLAYWRIGHT_HEADLESS) || false,
    channel: 'chrome',
  })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 974 },
  })
  // eslint-disable-next-line
  await (context as any)._enableRecorder({
    language: 'test',
    outputFile: testCaseFile,
    mode: 'recording',
    startRecording: true,
  } as EnableRecorderOption)
  const page = await context.newPage()
  const dispose = shouldRecordOneFixture
    ? recordAllInOneFixture(config, browser, page)
    : recordFixtures(config, browser, page)
  await page.goto(site)
  await dispose()
}
