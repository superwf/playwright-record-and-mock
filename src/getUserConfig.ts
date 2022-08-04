import { cosmiconfigSync } from 'cosmiconfig'
import pkg from '../package.json'
import { UserConfig } from './type'

export const getUserConfig = (): UserConfig => {
  const explorerSync = cosmiconfigSync(pkg.name)
  const search = explorerSync.search()
  const config = explorerSync.load(search!.filepath)?.config
  if (!config) {
    throw new Error('no config found')
  }
  return config
}
