import temp from 'temp'
import { resolveRoot } from './tool'

export const testInTempPath = (cb: (testPath: string) => void) => {
  const testPath = temp.mkdirSync(resolveRoot('temp-path-for-test'))
  const cwd = process.cwd()
  process.chdir(testPath)
  cb(testPath)

  // clean and restore cwd
  temp.cleanupSync()
  process.chdir(cwd)
}
