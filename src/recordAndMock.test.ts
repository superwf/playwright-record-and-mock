import path from 'path'
import fs from 'fs'
import { record } from './record'
import { getTestCaseMainFixtureFilePath, resolveRoot, sleep } from './tool'
import { initConfig } from './initConfig'
import { ResponseMap } from './type'
import { getMergedConfig } from './getMergedConfig'
import { prepareTmpPath } from './testTool'
import { preparePlaywright } from './preparePlaywright'
import { injectTestCase } from './injectTestCase'
import { writeToTestCaseFile } from './writeToTestCaseFile'
import { mock } from './mock'
// import { log } from './logger'

describe('record', () => {
  jest.setTimeout(30 * 1000)
  test('record', cb => {
    ;(async () => {
      const appRoot = process.cwd()
      prepareTmpPath()
      process.chdir('tmp')
      initConfig({
        outDir: 'e2e',
        site: 'https://cn.bing.com/',
        urlFilter: /\/AS\/Suggestions/,
      })

      const caseName = 'case1'

      const config = await getMergedConfig(['', '', caseName])
      const { page, browser } = await preparePlaywright(config)
      record({ config, page, browser })
      setTimeout(async () => {
        await page.locator('input[name="q"]').click() // Fill input[name="q"]

        await page.locator('input[name="q"]').fill('play') // Press Enter
        await sleep(500)
        await page.locator('input[name="q"]').fill('playwri') // Press Enter
        await sleep(500)
        await page.locator('input[name="q"]').fill('playwright') // Press Enter
        await sleep(500)

        await page.locator('input[name="q"]').press('Enter')

        await page.close()
        setTimeout(async () => {
          const fixtureFile = getTestCaseMainFixtureFilePath(config.outDir, caseName)
          expect(fs.existsSync(fixtureFile)).toBe(true)

          const fixtureJson = JSON.parse(fs.readFileSync(fixtureFile, { encoding: 'utf8' })) as ResponseMap
          const keys = Object.getOwnPropertyNames(fixtureJson)
          expect(keys.length > 0).toBe(true)
          const firstKey = keys[0]
          expect(Array.isArray(fixtureJson[firstKey])).toBe(true)
          expect(fs.existsSync(resolveRoot(path.join(config.outDir, caseName, fixtureJson[firstKey][0])))).toBe(true)
          const res = injectTestCase(config)
          const newCode = res.injectedCode
          // console.log(newCode)
          expect(newCode).toContain('await mock(page, __dirname)')
          expect(newCode).toContain("import { mock } from 'playwright-record-and-mock'")
          await writeToTestCaseFile(res)

          setTimeout(async () => {
            const { page: page1, browser: browser1 } = await preparePlaywright(config, true)
            page1.goto(config.site)

            await mock(page1, resolveRoot(path.join(config.outDir, caseName)))
            await page1.locator('input[name="q"]').click() // Fill input[name="q"]
            await page1.locator('input[name="q"]').fill('npmjs') // Press Enter
            await sleep(500)
            await page1.locator('input[name="q"]').fill('play') // Press Enter
            await sleep(500)
            await page1.locator('input[name="q"]').fill('playwri') // Press Enter
            await sleep(500)
            await page1.locator('input[name="q"]').fill('playwright')
            await sleep(500)
            await page1.close()
            await browser1.close()
            process.chdir(appRoot)
            cb()
          }, 2000)
        }, 2100)
      }, 1000)
    })()
  })
})
