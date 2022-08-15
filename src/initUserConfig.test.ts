import fs from 'fs'
import path from 'path'
import { initUserConfig } from './initUserConfig'
import { CONFIG_FILE_NAME } from './constant'
import { testInTempPath } from './test-tool'
import pkg from '../package.json'

test('create initUserConfig file', async () => {
  expect(CONFIG_FILE_NAME).toBe('playwright-record-and-mock.config.ts')
  expect(pkg.files.includes(CONFIG_FILE_NAME)).toBe(true)
  testInTempPath(testPath => {
    const configTargetFile = path.join(testPath, CONFIG_FILE_NAME)
    expect(fs.existsSync(configTargetFile)).toBe(false)
    initUserConfig()
    expect(fs.existsSync(configTargetFile)).toBe(true)
  })
})
