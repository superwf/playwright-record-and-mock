import type { BrowserContextOptions, Request } from '@playwright/test'

export type ConfigOption = {
  mockFilePath: string
  urlMatcher: RegExp
}

export type ResponseRecord = {
  status: number
  headers: Record<string, string>
  contentType: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

export type ResponseFile = string

export type ResponseMap = Record<string, ResponseFile[]>

export type UrlFilter = string | RegExp | ((url: URL) => boolean)

export type Config = {
  /** the place to store your e2e test cases */
  outDir: string
  /** decide which url should be recorded */
  urlFilter: UrlFilter
  /** your target test site full url, as https://www.npmjs.com */
  site: string
  /**
   * header filter, return a filtered new header
   * @default undefined
   * */
  responseHeadersInterceptor?: (headers: Record<string, string>) => Record<string, string>

  /**
   * custom your own match url key method
   * @default
   ```
   const generateResponseMapKey = async (req: Request) => {
     const url = new URL(req.url())
     return `${req.method()}+${url.protocol}//${url.host}${url.pathname}`
   }
   ```
   * */
  generateResponseMapKey?: (req: Request) => Promise<string>
}

export type PramConfig = {
  pram: Config
}

export type CliOption = {
  /** @private */
  _cached?: boolean
  /**
   * auto open site url
   * @example https://baidu.com
   * */
  site?: string

  init?: boolean
  caseName: string
  /** string split by ","
   * @example: "1920,1080"
   * */
  viewport?: string
}

export type MergedConfig = Config & {
  viewport?: BrowserContextOptions['viewport']
  caseName: CliOption['caseName']
}

export type InjectResult = {
  testCaseFile: string
  injectedCode: string
}
