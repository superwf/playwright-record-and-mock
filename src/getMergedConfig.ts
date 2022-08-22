import { getUserConfig } from './getUserConfig'
import { getCliOption } from './getCliOption'
import { MergedConfig } from './type'
import { viewportSizeToViewportDimension } from './tool'

/**
 * merge user config and cli option
 * cli option overwrite user config
 * */
export const getMergedConfig = async (argv?: readonly string[]): Promise<MergedConfig> => {
  const cliOption = await getCliOption(argv)
  const userConfig = await getUserConfig()

  const config: MergedConfig = {
    ...userConfig,
    site: cliOption.site || userConfig.site,
    caseName: cliOption.caseName,
  }

  if (cliOption.viewport) {
    config.viewport = viewportSizeToViewportDimension(cliOption.viewport)
  }

  return config
}
