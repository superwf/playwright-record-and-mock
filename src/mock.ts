import type { Page } from '@playwright/test'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import {
  decodeFromBase64,
  isContentTypeText,
  isContentTypeJson,
  isUrlMatched,
  resolveRoot,
  generateResponseMapKey,
} from './tool'
import { MAIN_FIXTURE_FILE, FIXTURES_DIR } from './constant'
import { ResponseMap } from './type'
import { getUserConfig } from './getUserConfig'

export const mock = async (page: Page, caseDir: string) => {
  const { urlFilter } = await getUserConfig()
  const mainFixtureFile = resolveRoot(join(caseDir, MAIN_FIXTURE_FILE))
  const mainFixtureFileExist = existsSync(mainFixtureFile)
  if (!mainFixtureFileExist) {
    throw new Error(`${mainFixtureFile} not exist!`)
  }
  const responseMap = JSON.parse(readFileSync(mainFixtureFile, { encoding: 'utf8' }).toString()) as ResponseMap
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
      const req = route.request()
      const recordResponses = responseMap[generateResponseMapKey(req)]
      if (recordResponses.length > 0) {
        const response = recordResponses.shift()
        const { contentType } = response!
        const { data, dataFile } = response!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let body: any
        if (data) {
          if (contentType.includes('json')) {
            body = JSON.stringify(data)
          } else if (isContentTypeText(contentType)) {
            body = data
          } else {
            body = decodeFromBase64(data)
          }
        } else if (dataFile) {
          const dataFilePath = resolveRoot(join(caseDir, FIXTURES_DIR, dataFile))
          if (isContentTypeJson(contentType) || isContentTypeText(contentType)) {
            const fileData = readFileSync(dataFilePath, { encoding: 'utf8' })
            body = fileData
          } else {
            const fileData = readFileSync(dataFilePath, { encoding: 'utf8' })
            body = decodeFromBase64(fileData)
          }
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
        console.warn(req.method(), req.url(), ' is using fallback')
      }
    },
  )
}
