/* eslint-disable no-param-reassign */
/** recordAllInOneFixture 与 recordFixtures 内的公用逻辑 */
import { writeFileSync } from 'fs'
import type { Page, Browser } from '@playwright/test'
import { getTestCaseMainFixtureFilePath } from './tool'
import { ResponseMap, MergedConfig as Config } from './type'

export const closePage =
  ({
    page,
    browser,
    responseMap,
    config,
  }: {
    page: Page
    browser: Browser
    responseMap: ResponseMap
    config: Config
  }) =>
  async () =>
    new Promise(resolve => {
      page.on('close', () => {
        const { outDir, caseName } = config
        const testCaseFixture = getTestCaseMainFixtureFilePath(outDir, caseName)
        writeFileSync(testCaseFixture, JSON.stringify(responseMap, null, 2))
        setTimeout(() => {
          browser.close()
          resolve(null)
        }, 1000)
      })
    })
