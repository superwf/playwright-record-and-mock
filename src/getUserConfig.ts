import { cosmiconfigSync } from 'cosmiconfig'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { parse } from 'json5'
import { UserConfig } from './type'

export const getUserConfig = (): UserConfig => {
  const pkg = parse(readFileSync(resolve(__dirname, '../package.json')).toString('utf8'))
  const explorerSync = cosmiconfigSync(pkg.name)
  const search = explorerSync.search()
  if (!search) {
    throw new Error('config file not exist!')
  }
  const config = explorerSync.load(search.filepath)?.config
  if (!config) {
    throw new Error('no config found')
  }
  return config
}
