import { cosmiconfigSync } from 'cosmiconfig'
import TypeScriptLoader from 'cosmiconfig-typescript-loader'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { parse } from 'json5'
import { UserConfig } from './type'
import { validateUserConfig } from './validateUserConfig'

export const getUserConfig = (): UserConfig => {
  const pkg = parse(readFileSync(resolve(__dirname, '../package.json')).toString('utf8'))
  const explorerSync = cosmiconfigSync(pkg.name, {
    loaders: {
      '.ts': TypeScriptLoader(),
    },
  })
  type CosmiconfigResult = ReturnType<typeof explorerSync.load> | undefined
  let search: CosmiconfigResult
  try {
    search = explorerSync.load(`${pkg.name}.config.ts`)
  } catch {
    if (!search) {
      search = explorerSync.search()
    }
    if (!search) {
      throw new Error('config file not exist!')
    }
  }

  const config: UserConfig = explorerSync.load(search!.filepath)?.config
  validateUserConfig(config)
  return config
}
