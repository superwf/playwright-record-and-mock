#! /usr/bin/env node
import fs from 'fs'
import { getConfig } from './getConfig'
import { initUserConfig } from './initUserConfig'
import { record } from './record'
import { injectTestCase } from './injectTestCase'

const runByCommandLine = async () => {
  const config = getConfig()
  if (config.init) {
    initUserConfig()
    return
  }
  if (config.caseName) {
    await record(config)
    const res = injectTestCase(config)
    fs.writeFileSync(res.testCaseFile, res.injectedCode, {
      encoding: 'utf8',
    })
  }
}

runByCommandLine()
