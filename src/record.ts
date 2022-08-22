import type { Browser, Page } from '@playwright/test'
import { join } from 'path'
import { ensureDir } from 'fs-extra'
import { MergedConfig as Config } from './type'
import { resolveRoot } from './tool'
import { recordFixtures } from './recordFixtures'
import { FIXTURES_DIR } from './constant'

export const record = async ({ config, browser, page }: { config: Config; browser: Browser; page: Page }) => {
  const { site, outDir, caseName } = config
  await ensureDir(resolveRoot(join(outDir, caseName, FIXTURES_DIR)))
  const dispose = recordFixtures(config, browser, page)
  await page.goto(site)
  await dispose()
}
