import { test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { ConfigOption, ResponseMap } from './type'
import { encodeToBase64, decodeFromBase64 } from './helper'

const cwd = process.cwd()
const resolveRoot = (p: string) => join(cwd, p)

export const factory = (o: ConfigOption) => {
  const apiFile = resolveRoot(o.mockFilePath)
  const matcher = o.urlMatcher
  let mockDataExist = existsSync(apiFile)
  const responseMap: ResponseMap = mockDataExist ? JSON.parse(readFileSync(apiFile).toString()) : {}

  const record = (forceOverwrite?: boolean) => {
    if (!mockDataExist || forceOverwrite) {
      test.afterEach(async ({ browser }) => {
        writeFileSync(apiFile, JSON.stringify(responseMap, null, 2))
        await browser.close()
      })
    }
    // 如果强制覆盖，则应视作mock文件不存在
    if (forceOverwrite && mockDataExist) {
      unlinkSync(apiFile)
      mockDataExist = false
    }
  }
  const mock = (page: Page) => {
    if (!mockDataExist) {
      page.on('response', async response => {
        const url = response.url()
        if (matcher.test(url)) {
          responseMap[url] = responseMap[url] || []
          const headers = response.headers()
          const contentType: string = headers['content-type'] || ''
          if (contentType.includes('text')) {
            responseMap[url].push({
              contentType,
              status: response.status(),
              headers: await response.allHeaders(),
              data: await response.text(),
            })
          } else if (contentType.includes('json')) {
            responseMap[url].push({
              contentType,
              status: response.status(),
              headers: await response.allHeaders(),
              data: await response.json(),
            })
          } else {
            responseMap[url].push({
              contentType,
              status: response.status(),
              headers: await response.allHeaders(),
              data: encodeToBase64(await response.body()),
            })
          }
        }
      })
    } else {
      page.route(
        url => {
          const { href } = url
          if (!matcher.test(href)) {
            return false
          }
          if (href in responseMap) {
            const res = responseMap[href]
            if (res.length > 0) {
              return true
            }
          }
          return false
        },
        async route => {
          const url = route.request().url()
          const responses = responseMap[url]
          if (responses.length > 0) {
            const response = responses.shift()
            const { contentType } = response!
            const { data } = response!
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let body: any
            if (contentType.includes('json')) {
              body = JSON.stringify(data)
            } else if (contentType.includes('text')) {
              body = data
            } else {
              body = decodeFromBase64(data)
            }
            route.fulfill({
              contentType,
              status: response!.status,
              headers: response!.headers,
              body,
            })
          } else {
            route.fallback()
            // eslint-disable-next-line no-console
            console.warn(url, ' is using fallback')
          }
        },
      )
    }
  }

  return { record, mock }
}
