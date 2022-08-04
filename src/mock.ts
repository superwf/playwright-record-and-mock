import type { Page } from '@playwright/test'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { decodeFromBase64, isContentTypeText } from './helper'
import { FIXTURE_FILE_NAME } from './constant'
import { isUrlMatched } from './isUrlMatched'
import { getUserConfig } from './getUserConfig'

export const mock = (page: Page) => {
  const dataFile = join(__dirname, FIXTURE_FILE_NAME)
  const mockDataExist = existsSync(dataFile)
  const { urlFilter } = getUserConfig()
  if (!mockDataExist) {
    throw new Error(`${dataFile} not exist!`)
  }
  const responseMap = JSON.parse(readFileSync(dataFile, { encoding: 'utf8' }).toString())
  return page.route(
    url => {
      const { href } = url
      if (!isUrlMatched(url, urlFilter)) {
        return false
      }
      if (href in responseMap) {
        const recordResponses = responseMap[href]
        if (recordResponses.length > 0) {
          return true
        }
      }
      return false
    },
    async route => {
      const url = route.request().url()
      const recordResponses = responseMap[url]
      if (recordResponses.length > 0) {
        const response = recordResponses.shift()
        const { contentType } = response!
        const { data } = response!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let body: any
        if (contentType.includes('json')) {
          body = JSON.stringify(data)
        } else if (isContentTypeText(contentType)) {
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
