import path from 'path'
import { readFileSync } from 'fs'
import { ParseOptions, createCommand } from 'commander'
import json5 from 'json5'
import { CliOption } from './type'
import { CONFIG_FILE_NAME } from './constant'

const defaultCliOption: CliOption = {
  init: false,
  cached: false,
  caseName: '',
}

let cached: CliOption = defaultCliOption

export const resetCache = () => {
  cached = defaultCliOption
}

const collectCliOption = async (argv?: readonly string[], options?: ParseOptions): Promise<CliOption> => {
  const pkg = json5.parse(readFileSync(path.resolve(__dirname, '../package.json')).toString('utf8'))
  const name = Object.getOwnPropertyNames(pkg.bin)[0]
  const program = createCommand(name)
  program.version(pkg.version).usage('run `pram init` or `pram record mycase`')
  const promise1 = new Promise<CliOption>(resolve => {
    program
      .command('init')
      .description(`create ${CONFIG_FILE_NAME} config file`)
      .action(async () => {
        cached = {
          cached: true,
          init: true,
          caseName: '',
          site: '',
        }
        resolve(cached)
      })
  })
  const promise2 = new Promise<CliOption>(resolve => {
    program
      .command('record <casename>', { isDefault: true })
      .description(`record test case, example: "${name} mytestcase1"`)
      .option('-s, --site <string>', 'for example: http://example.com')
      .option('-v, --viewport <string>', 'for example: 1920,1080')
      .action((caseName, opts) => {
        const site = (opts.site || '').trim()
        const viewportSize = (opts.viewport || '').trim()
        cached = {
          cached: true,
          init: false,
          caseName,
          site,
          viewportSize,
        }
        resolve(cached)
      })
  })
  program.parse(argv, options)

  return Promise.race<CliOption>([promise1, promise2])
}

export const getCliOption = async (argv?: readonly string[], options?: ParseOptions): Promise<CliOption> => {
  if (cached.cached) {
    return cached
  }
  return collectCliOption(argv, options)
}
