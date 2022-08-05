import { writeFileSync } from 'fs'
import { join } from 'path'
import { ensureDir } from 'fs-extra'
import type { BrowserContextOptions, LaunchOptions } from '@playwright/test'
import { chromium } from '@playwright/test'
import { isUrlMatched } from './isUrlMatched'
import { ResponseMap, RecordResponse, Config } from './type'
import { resolveRoot, encodeToBase64, isContentTypeText, getTestCaseFilePath, getTestCaseFixturePath } from './helper'

/**
 * playwright record param
 * copy from playwright-core source
 */
type EnableRecorderOption = {
  language: string
  launchOptions?: LaunchOptions
  contextOptions?: BrowserContextOptions
  device?: string
  saveStorage?: string
  startRecording?: boolean
  outputFile?: string
}

export const record = async (config: Config) => {
  const { site, outDir, urlFilter, caseName, headless } = config
  await ensureDir(resolveRoot(join(outDir, caseName)))
  const testCaseFile = getTestCaseFilePath(outDir, caseName)
  const browser = await chromium.launch({
    headless,
    channel: 'chrome',
  })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 974 },
  })
  // eslint-disable-next-line
  await (context as any)._enableRecorder({
    startRecording: true,
    language: 'test',
    outputFile: testCaseFile,
  } as EnableRecorderOption)
  const page = await context.newPage()
  const responseMap: ResponseMap = {}
  page.on('response', async response => {
    const url = response.url()
    if (isUrlMatched(new URL(url), urlFilter)) {
      responseMap[url] = responseMap[url] || []
      const headers = response.headers()
      const contentType: string = headers['content-type'] || ''
      const recordResponse: RecordResponse = {
        contentType,
        status: response.status(),
        headers: await response.allHeaders(),
        data: '',
      }
      if (isContentTypeText(contentType)) {
        recordResponse.data = await response.text()
      } else if (contentType.includes('json')) {
        recordResponse.data = await response.json()
      } else {
        recordResponse.data = encodeToBase64(await response.body())
      }
      responseMap[url].push(recordResponse)
    }
  })
  await page.goto(site)
  // await browser.close()
  const testCaseFixture = getTestCaseFixturePath(outDir, caseName)
  await new Promise(resolve => {
    page.on('close', () => {
      writeFileSync(testCaseFixture, JSON.stringify(responseMap, null, 2))
      setTimeout(() => {
        browser.close()
        resolve(null)
      }, 1000)
    })
  })
}
