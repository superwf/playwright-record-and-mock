import { getUserConfig } from './getUserConfig'
import { getCliOption } from './getCliOption'
import { Config } from './type'
import { toViewport } from './toViewport'

/**
 * merge user config and cli option
 * cli option overwrite user config
 * */
export const getConfig = (): Config => {
  const cliOption = getCliOption()

  if (!cliOption.site) {
    delete cliOption.site
  }
  if (!cliOption.viewportSize) {
    delete cliOption.viewportSize
  }
  const userConfig = getUserConfig()
  const config: Config = {
    ...userConfig,
    ...cliOption,
    viewport: toViewport(cliOption.viewportSize || userConfig.viewportSize),
  }
  return config
}
