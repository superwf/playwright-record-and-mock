import { Config } from './type'

export const PKG_NAME = 'playwright-record-and-mock'
export const PLAYWRIGHT_CONFIG_FILE = 'playwright.config.ts'

export const TEST_CASE_FILE_NAME = 'run.spec.ts'
export const MAIN_FIXTURE_FILE = 'fixture.json'
export const FIXTURES_DIR = 'fixtures'

export const DEFAULT_VIEWPORT = { width: 1920, height: 974 }

export const DEFAULT_CONFIG: Config = {
  outDir: 'e2e',
  site: 'https://cn.bing.com/',
  urlFilter: /\/AS\/Suggestions/,
}
