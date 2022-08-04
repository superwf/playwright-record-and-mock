import fs from 'fs'
import { join } from 'path'
import { resolveRoot } from './resolveRoot'
import { CONFIG_FILE_NAME } from './constant'

export const initUserConfig = () => {
  fs.writeFileSync(resolveRoot(CONFIG_FILE_NAME), fs.readFileSync(join(__dirname, CONFIG_FILE_NAME)))
}
