/* eslint-disable global-require,import/no-dynamic-require,@typescript-eslint/no-explicit-any,@typescript-eslint/no-var-requires */
import fs from 'fs'
import { join } from 'path'
import json5 from 'json5'
import { register } from 'ts-node'
import { Config } from './type'
import { validateUserConfig } from './validateUserConfig'
import { PLAYWRIGHT_CONFIG_FILE } from './constant'
import { resolveRoot } from './tool'

export const getUserConfig = async (): Promise<Config> => {
  /** 本包本地开发时，执行 yarn e2e-codegen 时直接用ts-node执行，不能再重复注册ts-node环境 */
  if (!process.env.PRAM_DEV_MODE) {
    const tsconfigFile = join(__dirname, '..', 'tsconfig.json')
    let tsconfig: Record<string, any> = {}
    if (fs.existsSync(tsconfigFile)) {
      tsconfig = json5.parse(
        fs.readFileSync(tsconfigFile, {
          encoding: 'utf8',
        }),
      )
    }
    const compilerOptions = tsconfig.compilerOptions || {}
    register({
      typeCheck: false,
      compilerOptions: {
        ...compilerOptions,
        // 本地开发模式执行 yarn e2e 时必须还用tsconfig中的paths，发布之后就必须为空数组
        paths: process.env.PRAM_USE_PATH_ALIAS ? compilerOptions.paths : [],
        /** 必须使用commonjs，否则在nodejs环境跑不起来 */
        module: 'commonjs',
      },
    })
  }

  const playwrightConfig: { pram: Config } = require(resolveRoot(PLAYWRIGHT_CONFIG_FILE)).default

  validateUserConfig(playwrightConfig!.pram)
  return playwrightConfig!.pram
}
