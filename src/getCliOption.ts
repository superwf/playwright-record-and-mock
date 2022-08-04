import { resolve } from 'path'
import { readFileSync } from 'fs'
import { Command, ParseOptions } from 'commander'
import { parse } from 'json5'
import { CliOption } from './type'

const program = new Command()

let cached: CliOption = {
  init: false,
  cached: false,
  caseName: '',
}

export const resetCache = () => {
  cached = {
    init: false,
    cached: false,
    caseName: '',
  }
}

export const collectCliOption = (argv?: readonly string[], options?: ParseOptions): CliOption => {
  const pkg = parse(readFileSync(resolve(__dirname, '../package.json')).toString('utf8'))
  program
    .version(pkg.version)
    .usage('pram --init and run it')
    .option('-i, --init', `create playwright-record-and-mock.js config file`)
    .option('-c, --casename <string>', 'test case name')
    .option('-s, --site <string>', 'for example: http://example.com')
    .option('-v, --viewport <string>', 'for example: 1920,1080')
    .parse(argv, options)

  const option = program.opts()
  const caseName = (option.casename || '').trim()
  const site = (option.site || '').trim()
  const viewportSize = (option.viewport || '').trim()

  const init = Boolean(option.init)
  // 此处删除是为了测试用例通过
  delete option.init
  delete option.config
  if (init) {
    cached = {
      cached: true,
      init,
      caseName: '',
      viewportSize,
    }
    return cached
  }
  cached = {
    cached: true,
    init,
    caseName,
    site,
    viewportSize,
  }
  return cached
}

export const getCliOption = (argv?: readonly string[], options?: ParseOptions): CliOption => {
  if (cached.cached) {
    return cached
  }
  return collectCliOption(argv, options)
}
