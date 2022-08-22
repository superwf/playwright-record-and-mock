#! /usr/bin/env node
import { getMergedConfig } from './getMergedConfig'
import { getCliOption } from './getCliOption'
import { initConfig } from './initConfig'
import { record } from './record'
import { injectTestCase } from './injectTestCase'
import { writeToTestCaseFile } from './writeToTestCaseFile'
import { preparePlaywright } from './preparePlaywright'

const runByCommandLine = async () => {
  const cliOption = await getCliOption()
  if (cliOption.init) {
    initConfig()
    return
  }
  if (cliOption.caseName) {
    const config = await getMergedConfig()
    const { page, browser } = await preparePlaywright(config)
    await record({
      config,
      browser,
      page,
    })
    const res = injectTestCase(config)
    await writeToTestCaseFile(res)
  }
}

runByCommandLine()
