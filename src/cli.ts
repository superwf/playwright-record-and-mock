import { getConfig } from './getConfig'
import { initUserConfig } from './initUserConfig'
import { record } from './record'

const run = () => {
  const config = getConfig()
  if (config.init) {
    initUserConfig()
    return
  }
  if (config.caseName) {
    record()
  }
}

run()
