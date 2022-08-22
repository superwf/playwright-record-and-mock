import path from 'path'
import { readFileSync } from 'fs'
import { ParseOptions, createCommand } from 'commander'
import json5 from 'json5'
import { CliOption } from './type'
import { PLAYWRIGHT_CONFIG_FILE } from './constant'

const defaultCliOption: CliOption = {
  init: false,
  _cached: false,
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
      .description(`inject "pram" part to ${PLAYWRIGHT_CONFIG_FILE}`)
      .action(async () => {
        cached = {
          _cached: true,
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
        const viewport = (opts.viewport || '').trim()
        cached = {
          _cached: true,
          caseName,
          site,
          viewport,
        }
        resolve(cached)
      })
  })
  program.parse(argv, options)

  return Promise.race<CliOption>([promise1, promise2])
}

export const getCliOption = async (argv?: readonly string[], options?: ParseOptions): Promise<CliOption> => {
  if (cached._cached) {
    return cached
  }
  return collectCliOption(argv, options)
}
