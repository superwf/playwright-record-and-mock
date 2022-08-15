import path from 'path'
import fs from 'fs'
import { getUserConfig } from './getUserConfig'
import defaultConfig from '../playwright-record-and-mock.config'
import { UserConfig } from './type'
import { testInTempPath } from './test-tool'
import pkg from '../package.json'

test('getConfig default is ts file', () => {
  expect(getUserConfig()).toEqual(defaultConfig)
})

test('getConfig js file', () => {
  testInTempPath(testPath => {
    const configTargetFile = path.join(testPath, `${pkg.name}.config.js`)
    const config: UserConfig = {
      outDir: 'teste2e',
      site: 'http://aaa.com',
      urlFilter: '**/api/**',
    }
    const content = `module.exports = ${JSON.stringify(config)}`
    fs.writeFileSync(configTargetFile, content, { encoding: 'utf8' })

    expect(getUserConfig()).toEqual(config)
  })
})

test('getConfig js file', () => {
  testInTempPath(testPath => {
    const configTargetFile = path.join(testPath, `${pkg.name}.config.js`)
    const config: UserConfig = {
      outDir: 'teste2e',
      site: 'http://aaa.com',
      urlFilter: '**/api/**',
    }
    const content = `module.exports = ${JSON.stringify(config)}`
    fs.writeFileSync(configTargetFile, content, { encoding: 'utf8' })

    expect(getUserConfig()).toEqual(config)
  })
})

test('no config exist', () => {
  testInTempPath(() => {
    expect(getUserConfig).toThrow()
  })
})
