import { cosmiconfigSync } from 'cosmiconfig'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { parse } from 'json5'
import { UserConfig } from './type'
import { validateUserConfig } from './validateUserConfig'

export const getUserConfig = (): UserConfig => {
  const pkg = parse(readFileSync(resolve(__dirname, '../package.json')).toString('utf8'))
  const explorerSync = cosmiconfigSync(pkg.name)
  const search = explorerSync.search()
  // see https://github.com/bcoe/c8/blob/main/README.md
  /* c8 ignore next 3 */
  if (!search) {
    throw new Error('config file not exist!')
  }
  const config: UserConfig = explorerSync.load(search.filepath)?.config
  validateUserConfig(config)
  return config
}
