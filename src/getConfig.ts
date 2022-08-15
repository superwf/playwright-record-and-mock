import { getUserConfig } from './getUserConfig'
import { getCliOption } from './getCliOption'
import { Config } from './type'
import { viewportSizeToViewportDimension } from './tool'

const defaultConfig = {
  init: false,
  cached: false,
  site: '',
  urlFilter: '',
  caseName: '',
  outDir: '',
}

let cached: Config = defaultConfig

export const resetCache = () => {
  cached = defaultConfig
}

/**
 * merge user config and cli option
 * cli option overwrite user config
 * */
export const getConfig = async (): Promise<Config> => {
  if (cached.cached) {
    return cached
  }

  const cliOption = await getCliOption()
  const userConfig = getUserConfig()

  const config: Config = {
    cached: true,
    headless: false,
    site: cliOption.site || userConfig.site,
    urlFilter: userConfig.urlFilter,
    outDir: userConfig.outDir,
    init: cliOption.init,
    caseName: cliOption.caseName,
  }

  const viewportSize = cliOption.viewportSize || userConfig.viewportSize
  if (viewportSize) {
    config.viewportSize = viewportSizeToViewportDimension(viewportSize)
  }

  cached = config
  return config
}
