/* eslint-disable no-param-reassign */
import { writeFileSync } from 'fs'
import type { Page, Browser } from '@playwright/test'
import shortuuid from 'short-uuid'
import { ResponseRecord, ResponseMap, Config } from './type'
import {
  encodeToBase64,
  isContentTypeText,
  isContentTypeJson,
  getTestCaseFixtureFilePath,
  cleanTestCaseFixtureFilePath,
} from './tool'
import { listenResponse, closePage } from './recordHelper'

export const recordFixtures = (config: Config, browser: Browser, page: Page) => {
  const { outDir, caseName } = config
  const s = shortuuid()
  const responseMap: ResponseMap = {}
  listenResponse({
    page,
    config,
    responseMap,
    processContentType: async (contentType, responseRecord, response) => {
      // 3xx no body
      if (contentType) {
        let data = ''
        try {
          // json也当文本处理
          if (isContentTypeText(contentType) || isContentTypeJson(contentType)) {
            data = await response.text()
          } else {
            data = encodeToBase64(await response.body())
          }
          // eslint-disable-next-line no-empty
        } catch {}
        if (data) {
          const dataFile: ResponseRecord['dataFile'] = `${Date.now()}-${s.new().slice(0, 6)}`
          const testCaseFixture = getTestCaseFixtureFilePath(outDir, caseName, dataFile)
          writeFileSync(testCaseFixture, data)
          responseRecord.dataFile = dataFile
        }
      }
    },
  })
  cleanTestCaseFixtureFilePath(outDir, caseName)
  return closePage({ page, browser, responseMap, config })
}
