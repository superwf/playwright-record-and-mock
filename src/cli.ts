#! /usr/bin/env node
import { getConfig } from './getConfig'
import { initUserConfig } from './initUserConfig'
import { record } from './record'
import { injectTestCase } from './injectTestCase'
import { writeToTestCaseFile } from './writeToTestCaseFile'

const runByCommandLine = async () => {
  const config = await getConfig()
  if (config.init) {
    initUserConfig()
    return
  }
  if (config.caseName) {
    await record(config)
    const res = injectTestCase(config)
    await writeToTestCaseFile(res)
  }
}

runByCommandLine()
