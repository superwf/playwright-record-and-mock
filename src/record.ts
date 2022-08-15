import { writeFileSync } from 'fs'
import { join } from 'path'
import { ensureDir } from 'fs-extra'
import type { BrowserContextOptions, LaunchOptions } from '@playwright/test'
import { chromium } from '@playwright/test'
import { ResponseMap, RecordResponse, Config } from './type'
import {
  resolveRoot,
  encodeToBase64,
  isContentTypeText,
  isContentTypeJson,
  isUrlMatched,
  getTestCaseFilePath,
  getTestCaseFixturePath,
  generateResponseMapKey,
} from './tool'

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
    language: 'test',
    outputFile: testCaseFile,
    mode: 'recording',
    startRecording: true,
  } as EnableRecorderOption)
  const page = await context.newPage()
  const responseMap: ResponseMap = {}
  page.on('response', async response => {
    const url = response.url()
    const key = generateResponseMapKey(response.request())
    if (isUrlMatched(new URL(url), urlFilter)) {
      responseMap[key] = responseMap[key] || []
      const headers = response.headers()
      const contentType: string = headers['content-type'] || ''
      const status = response.status()
      const recordResponse: RecordResponse = {
        contentType,
        status,
        headers: await response.allHeaders(),
      }
      // 3xx no body
      if (contentType) {
        try {
          if (isContentTypeText(contentType)) {
            recordResponse.data = await response.text()
            // 其实json也应该当文本处理，不过按对象处理，更容易修改
          } else if (isContentTypeJson(contentType)) {
            recordResponse.data = await response.json()
          } else {
            recordResponse.data = encodeToBase64(await response.body())
          }
          // eslint-disable-next-line no-empty
        } catch {}
      }
      responseMap[key].push(recordResponse)
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
