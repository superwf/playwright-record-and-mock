/* eslint-disable no-param-reassign */
/** recordAllInOneFixture 与 recordFixtures 内的公用逻辑 */
import { writeFileSync } from 'fs'
import type { Page, Browser, Response } from '@playwright/test'
import {
  getTestCaseOneFixtureFilePath,
  encodeToBase64,
  isContentTypeText,
  isContentTypeJson,
  isUrlMatched,
  generateResponseMapKey,
} from './tool'
import { ResponseMap, Config, ResponseRecord } from './type'

export const listenResponse = (
  page: Page,
  config: Config,
  responseMap: ResponseMap,
  processContentType: (contentType: string, responseRecord: ResponseRecord, response: Response) => Promise<unknown>,
) => {
  const { urlFilter, headersInterceptor } = config
  page.on('response', async response => {
    const url = response.url()
    const key = generateResponseMapKey(response.request())
    if (isUrlMatched(new URL(url), urlFilter)) {
      responseMap[key] = responseMap[key] || []
      let headers = await response.allHeaders()
      const contentType: string = headers['content-type'] || ''
      const status = response.status()
      if (headersInterceptor) {
        headers = headersInterceptor(headers)
      }
      const responseRecord: ResponseRecord = {
        contentType,
        status,
        headers,
      }
      await processContentType(contentType, responseRecord, response)
      responseMap[key].push(responseRecord)
    }
  })
}

export const closePage = (page: Page, browser: Browser, responseMap: ResponseMap, config: Config) => async () =>
  new Promise(resolve => {
    page.on('close', () => {
      const { outDir, caseName } = config
      const testCaseFixture = getTestCaseOneFixtureFilePath(outDir, caseName)
      writeFileSync(testCaseFixture, JSON.stringify(responseMap, null, 2))
      setTimeout(() => {
        browser.close()
        resolve(null)
      }, 1000)
    })
  })
