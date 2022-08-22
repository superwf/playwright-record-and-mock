import fs from 'fs'
import path from 'path'
import { initConfig } from './initConfig'
import { PLAYWRIGHT_CONFIG_FILE } from './constant'
import { resolveRoot } from './tool'
import { testInTempPath } from './testTool'

test('create initConfig file', () => {
  const originConfigFile = resolveRoot(PLAYWRIGHT_CONFIG_FILE)
  const { testPath, restore } = testInTempPath()
  const configTargetFile = path.join(testPath, PLAYWRIGHT_CONFIG_FILE)
  fs.cpSync(originConfigFile, configTargetFile)
  expect(fs.existsSync(configTargetFile)).toBe(true)
  initConfig()
  const code = fs.readFileSync(resolveRoot(PLAYWRIGHT_CONFIG_FILE), {
    encoding: 'utf8',
  })
  expect(code).toMatchSnapshot()
  restore()
})
