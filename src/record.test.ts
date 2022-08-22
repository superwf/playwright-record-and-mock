import path from 'path'
import fs from 'fs'
import { record } from './record'
import { getTestCaseMainFixtureFilePath, resolveRoot } from './tool'
import { initConfig } from './initConfig'
import { ResponseMap } from './type'
import { getMergedConfig } from './getMergedConfig'
import { prepareTmpPath } from './testTool'
import { preparePlaywright } from './preparePlaywright'
import { injectTestCase } from './injectTestCase'
// import { log } from './logger'

describe('record', () => {
  jest.setTimeout(999999)
  test('record', async () => {
    const appRoot = process.cwd()
    prepareTmpPath()
    process.chdir('tmp')
    initConfig()

    const caseName = 'case1'

    const config = await getMergedConfig(['', '', caseName])
    const { page, browser } = await preparePlaywright(config)
    // await page.goto('https://www.npmjs.com/')
    const promise = new Promise(resolve => {
      setTimeout(async () => {
        await page.locator('[placeholder="Search packages"]').click() // Fill [placeholder="Search packages"]

        await page.locator('[placeholder="Search packages"]').fill('playwright-record') // Click text=## a playwright tool for record api and replay

        await page.locator('text=## a playwright tool for record api and replay').click()

        await page.close()
        const fixtureFile = getTestCaseMainFixtureFilePath(config.outDir, caseName)
        expect(fs.existsSync(fixtureFile)).toBe(true)

        const fixtureJson = JSON.parse(fs.readFileSync(fixtureFile, { encoding: 'utf8' })) as ResponseMap
        const keys = Object.getOwnPropertyNames(fixtureJson)
        expect(keys.length > 0).toBe(true)
        const firstKey = keys[0]
        expect(Array.isArray(fixtureJson[firstKey])).toBe(true)
        expect(fs.existsSync(resolveRoot(path.join(config.outDir, caseName, fixtureJson[firstKey][0])))).toBe(true)
        resolve(null)
      }, 100)
    })
    await record({ config, page, browser })
    const res = injectTestCase(config)
    expect(res.injectedCode).toMatchSnapshot()
    await promise
    process.chdir(appRoot)
  })
})
