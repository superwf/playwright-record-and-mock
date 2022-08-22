import path from 'path'
import temp from 'temp'
import { ensureDirSync, rmSync, cpSync } from 'fs-extra'
import { resolveRoot } from './tool'
import { PLAYWRIGHT_CONFIG_FILE } from './constant'

/**
 * 创建一个临时文件夹作为当前目录
 * 完成后还原目录并清理临时文件
 * 仅测试用
 * */
export const testInTempPath = () => {
  const testPath = temp.mkdirSync(resolveRoot('temp-path-for-test'))
  const cwd = process.cwd()
  process.chdir(testPath)
  return {
    testPath,
    restore() {
      temp.cleanupSync()
      process.chdir(cwd)
    },
  }
}

export const prepareTmpPath = () => {
  ensureDirSync('tmp')
  rmSync('tmp/*', { recursive: true, force: true })
  const originConfigFile = resolveRoot(PLAYWRIGHT_CONFIG_FILE)
  const targetConfigFile = path.join('tmp', PLAYWRIGHT_CONFIG_FILE)
  cpSync(originConfigFile, targetConfigFile)
}
