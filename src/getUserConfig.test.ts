import path from 'path'
import fs from 'fs'
import { getUserConfig } from './getUserConfig'
import defaultConfig from '../playwright-record-and-mock.config'
import { UserConfig } from './type'
import { testInTempPath } from './testTool'
import { CONFIG_FILE_NAME } from './constant'

test('getConfig default ts file', async () => {
  const config = await getUserConfig()
  expect(config).toEqual(defaultConfig)
})

test('getConfig js file', async () => {
  await testInTempPath(async testPath => {
    const configTargetFile = path.join(testPath, CONFIG_FILE_NAME.replace('.ts', '.js'))
    const config: UserConfig = {
      outDir: 'teste2e',
      site: 'http://aaa.com',
      urlFilter: '**/api/**',
    }
    const content = `module.exports = ${JSON.stringify(config)}`
    fs.writeFileSync(configTargetFile, content, { encoding: 'utf8' })

    expect(await getUserConfig()).toEqual(config)
  })
})

test('getConfig js file', async () => {
  await testInTempPath(async testPath => {
    const configTargetFile = path.join(testPath, CONFIG_FILE_NAME.replace('.ts', '.js'))
    const config: UserConfig = {
      outDir: 'teste2e',
      site: 'http://aaa.com',
      urlFilter: '**/api/**',
    }
    const content = `module.exports = ${JSON.stringify(config)}`
    fs.writeFileSync(configTargetFile, content, { encoding: 'utf8' })

    expect(await getUserConfig()).toEqual(config)
  })
})

test('no config exist', () =>
  testInTempPath(async () => getUserConfig()).catch(err => {
    expect(err.message).toBe('config file not exist!')
  }))
