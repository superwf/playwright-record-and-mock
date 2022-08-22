import path from 'path'
import fs from 'fs'
import { getUserConfig } from './getUserConfig'
// import { Config } from './type'
import { testInTempPath } from './testTool'
import { PLAYWRIGHT_CONFIG_FILE, DEFAULT_CONFIG } from './constant'
import { initConfig } from './initConfig'
import { resolveRoot } from './tool'

test('getConfig js file', async () => {
  const originConfigFile = resolveRoot(PLAYWRIGHT_CONFIG_FILE)
  const { testPath, restore } = testInTempPath()
  const configTargetFile = path.join(testPath, PLAYWRIGHT_CONFIG_FILE)
  fs.cpSync(originConfigFile, configTargetFile)
  initConfig()
  expect(await getUserConfig()).toEqual(DEFAULT_CONFIG)

  restore()
})

// test('no config exist', () =>
//   testInTempPath(async () => getUserConfig()).catch(err => {
//     expect(err.message).toBe('config file not exist!')
//   }))
