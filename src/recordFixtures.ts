/* eslint-disable no-param-reassign */
import { writeFileSync } from 'fs'
import { join } from 'path'
import type { Page, Browser } from '@playwright/test'
import shortuuid from 'short-uuid'
import { ResponseRecord, ResponseMap, MergedConfig as Config } from './type'
import {
  isUrlMatched,
  generateResponseMapKey as defaultGenerateResponseMapKey,
  encodeToBase64,
  isContentTypeText,
  isContentTypeJson,
  getTestCaseFixtureFilePath,
  cleanTestCaseFixtureFilePath,
} from './tool'
import { closePage } from './recordHelper'
import { FIXTURES_DIR } from './constant'

export const recordFixtures = (config: Config, browser: Browser, page: Page) => {
  const { urlFilter, responseHeadersInterceptor, outDir, caseName } = config
  const generateResponseMapKey = config.generateResponseMapKey || defaultGenerateResponseMapKey
  const s = shortuuid()
  const responseMap: ResponseMap = {}
  page.on('response', async response => {
    const url = response.url()
    const key = await generateResponseMapKey(response.request())
    if (isUrlMatched(new URL(url), urlFilter)) {
      responseMap[key] = responseMap[key] || []
      let headers = await response.allHeaders()
      const contentType: string = headers['content-type'] || ''
      const status = response.status()
      if (responseHeadersInterceptor) {
        headers = responseHeadersInterceptor(headers)
      }
      const responseRecord: ResponseRecord = {
        contentType,
        status,
        headers,
      }
      // await processContentType(contentType, responseRecord, response)
      // 3xx no body
      const dataFile = `${Date.now().toString().slice(-6, -1)}-${s.new().slice(0, 6)}`
      if (contentType) {
        let data = ''
        try {
          if (isContentTypeJson(contentType)) {
            data = await response.json()
          } else if (isContentTypeText(contentType)) {
            data = await response.text()
          } else {
            data = encodeToBase64(await response.body())
          }
          // eslint-disable-next-line no-empty
        } catch {}
        if (data) {
          responseRecord.data = data
        }
      }
      const testCaseFixture = getTestCaseFixtureFilePath(outDir, caseName, dataFile)
      writeFileSync(testCaseFixture, JSON.stringify(responseRecord), { encoding: 'utf8' })
      responseMap[key].push(`./${join(FIXTURES_DIR, dataFile)}`)
    }
  })

  cleanTestCaseFixtureFilePath(outDir, caseName)
  return closePage({ page, browser, responseMap, config })
}
