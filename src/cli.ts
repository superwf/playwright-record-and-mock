#! /usr/bin/env node
import { getMergedConfig } from './getMergedConfig'
import { getCliOption } from './getCliOption'
import { initConfig } from './initConfig'
import { record } from './record'
import { injectTestCase } from './injectTestCase'
import { writeToTestCaseFile } from './writeToTestCaseFile'

const runByCommandLine = async () => {
  const cliOption = await getCliOption()
  if (cliOption.init) {
    initConfig()
    return
  }
  if (cliOption.caseName) {
    const config = await getMergedConfig()
    await record(config)
    const res = injectTestCase(config)
    await writeToTestCaseFile(res)
  }
}

runByCommandLine()
