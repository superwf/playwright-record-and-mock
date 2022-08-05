import minimatch from 'minimatch'
import { resolve, join } from 'path'
import { Config, UrlFilter } from './type'
import { FIXTURE_FILE_NAME, TEST_CASE_FILE_NAME } from './constant'

export const resolveRoot = (relativePath: string) => resolve(process.cwd(), relativePath)

export const encodeToBase64 = (str: string | Buffer): string => Buffer.from(str).toString('base64')

export const decodeFromBase64 = (base64str: string): Buffer => Buffer.from(base64str, 'base64')

export const isContentTypeText = (contentType: string) => /text|script|xml|xhtml/.test(contentType)
export const isContentTypeJson = (contentType: string) => /application\/json/.test(contentType)

export const viewportSizeToViewportDimension = (viewportSize?: string): Config['viewportSize'] => {
  if (viewportSize) {
    if (!/^\d+,\d+$/.test(viewportSize)) {
      throw new Error('viewportSize must be dimension like "1920,1080"')
    }
    const [width, height] = viewportSize.split(',').map<number>(n => parseInt(n, 10))
    return {
      width,
      height,
    }
  }
  return undefined
}

export const getTestCaseFilePath = (outDir: string, caseName: string) =>
  resolveRoot(join(outDir, caseName, TEST_CASE_FILE_NAME))
export const getTestCaseFixturePath = (outDir: string, caseName: string) =>
  resolveRoot(join(outDir, caseName, FIXTURE_FILE_NAME))

export const isUrlMatched = (url: URL, urlFilter?: UrlFilter): boolean => {
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
  /* c8 ignore next 2 */
  return true
}
