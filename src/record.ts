import { join } from 'path'
import { writeFileSync } from 'fs'
import type { BrowserContextOptions, LaunchOptions } from '@playwright/test'
import { chromium } from '@playwright/test'
import { getConfig } from './getConfig'
import { isUrlMatched } from './isUrlMatched'
import { ResponseMap, RecordResponse } from './type'
import { encodeToBase64, isContentTypeText } from './helper'
import { FIXTURE_FILE_NAME } from './constant'
import { getCliOption } from './getCliOption'

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

export const record = async () => {
  const { site, outDir, urlFilter } = getConfig()
  const { caseName } = getCliOption()
  const outCaseDir = join(outDir, caseName)
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 974 },
  })
  // eslint-disable-next-line
  await (context as any)._enableRecorder({
    startRecording: true,
    language: 'test',
    outputFile: join(outCaseDir, '/index.spec.ts'),
  } as EnableRecorderOption)
  const page = await context.newPage()
  const responseMap: ResponseMap = {}
  page.on('response', async response => {
    const url = response.url()
    if ((isUrlMatched(new URL(url)), urlFilter)) {
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
  await new Promise(resolve => {
    page.on('close', () => {
      const fixtureFile = join(outCaseDir, FIXTURE_FILE_NAME)
      writeFileSync(fixtureFile, JSON.stringify(responseMap, null, 2))
      setTimeout(() => {
        browser.close()
        resolve(null)
      }, 1000)
    })
  })
}
