import temp from 'temp'
import { resolveRoot } from './tool'

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
