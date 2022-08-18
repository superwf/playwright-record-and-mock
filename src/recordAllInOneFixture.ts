/* eslint-disable no-param-reassign */
import type { Page, Browser } from '@playwright/test'
import { ResponseMap, Config } from './type'
import { encodeToBase64, isContentTypeText, isContentTypeJson } from './tool'
import { listenResponse, closePage } from './recordHelper'

export const recordAllInOneFixture = (config: Config, browser: Browser, page: Page) => {
  const responseMap: ResponseMap = {}
  listenResponse({
    page,
    config,
    responseMap,
    processContentType: async (contentType, responseRecord, response) => {
      // some http status has no body, like 3xx
      if (contentType) {
        try {
          if (isContentTypeText(contentType)) {
            responseRecord.data = await response.text()
            // 其实json也应该当文本处理，不过按对象处理，更容易修改
          } else if (isContentTypeJson(contentType)) {
            responseRecord.data = await response.json()
          } else {
            responseRecord.data = encodeToBase64(await response.body())
          }
          // eslint-disable-next-line no-empty
        } catch {}
      }
    },
  })
  return closePage({ page, browser, responseMap, config })
}
