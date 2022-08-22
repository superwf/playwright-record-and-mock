import type { Request, BrowserContextOptions } from '@playwright/test'
import { emptydirSync } from 'fs-extra'
import minimatch from 'minimatch'
import { resolve, join } from 'path'
import { UrlFilter } from './type'
import { MAIN_FIXTURE_FILE, TEST_CASE_FILE_NAME, FIXTURES_DIR } from './constant'

export const resolveRoot = (relativePath: string) => resolve(process.cwd(), relativePath)

export const encodeToBase64 = (str: string | Buffer): string => Buffer.from(str).toString('base64')

export const decodeFromBase64 = (base64str: string): Buffer => Buffer.from(base64str, 'base64')

export const isContentTypeText = (contentType: string) => /text|script|xml|xhtml/.test(contentType)
export const isContentTypeJson = (contentType: string) => /application\/json/.test(contentType)

export const viewportSizeToViewportDimension = (
  viewport?: string | BrowserContextOptions['viewport'],
): BrowserContextOptions['viewport'] => {
  if (typeof viewport === 'string') {
    if (!/^\d+,\d+$/.test(viewport)) {
      throw new Error('viewportSize must be dimension like "1920,1080"')
    }
    const [width, height] = viewport.split(',').map<number>(n => parseInt(n, 10))
    return {
      width,
      height,
    }
  }
  return viewport
}

export const getTestCaseFilePath = (outDir: string, caseName: string) =>
  resolveRoot(join(outDir, caseName, TEST_CASE_FILE_NAME))

export const getTestCaseMainFixtureFilePath = (outDir: string, caseName: string) =>
  resolveRoot(join(outDir, caseName, MAIN_FIXTURE_FILE))

export const getTestCaseFixtureFilePath = (outDir: string, caseName: string, dataFile: string) =>
  resolveRoot(join(outDir, caseName, FIXTURES_DIR, dataFile))

export const cleanTestCaseFixtureFilePath = (outDir: string, caseName: string) => {
  const path = resolveRoot(join(outDir, caseName, FIXTURES_DIR))
  emptydirSync(path)
}

export const isUrlMatched = (url: URL, urlFilter?: UrlFilter): boolean => {
  // see https://github.com/bcoe/c8/blob/main/README.md
  /* c8 ignore next 14 */
  if (!urlFilter) {
    return true
  }
  if (typeof urlFilter === 'string') {
    return minimatch(url.href, urlFilter)
  }
  if (urlFilter instanceof RegExp) {
    return urlFilter.test(url.href)
  }
  if (typeof urlFilter === 'function') {
    return urlFilter(url)
  }
  return true
}

export const generateResponseMapKey = async (req: Request) => {
  const url = new URL(req.url())
  return `${req.method()}+${url.protocol}//${url.host}${url.pathname}`
}
