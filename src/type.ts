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
  dataFile?: string
}

export type ResponseMap = Record<string, ResponseRecord[]>

export type UrlFilter = string | RegExp | ((url: URL) => boolean)

export type UserConfig = {
  /** the place to store your e2e test cases */
  outDir: string
  /** decide which url should be recorded */
  urlFilter: UrlFilter
  /** your target test site full url, as https://www.npmjs.com */
  site: string
  /** split by ",", as "1920,1080" */
  viewportSize?: string
  /**
   * should record all fixture data in one file
   * @default false
   * */
  shouldRecordALlInOne?: boolean
  /**
   * header filter
   * @default undefined
   * */
  responseHeadersInterceptor?: (headers: Record<string, string>) => Record<string, string>
}

export type CliOption = {
  /** @private */
  cached: boolean
  /**
   * @example https://baidu.com
   * */
  site?: string
  /** split by ",", as "1920,1080" */
  viewportSize?: string

  init: boolean
  caseName: string
}

export type Config = {
  /** @private */
  cached: boolean
  init: boolean
  site: string
  shouldRecordALlInOne?: boolean
  urlFilter: UrlFilter
  /**
   * if the response headers too much
   * you can use this to remove some useless header
   * example
   * ```
   responseHeadersInterceptor(headers) {
    Object.getOwnPropertyNames(headers).forEach(key => {
      if (key.startsWith('x-')) {
        delete headers[key]
      }
    })
    return headers
  },
   * ```
   * */
  responseHeadersInterceptor?: UserConfig['responseHeadersInterceptor']
  outDir: string
  caseName: string
  /** @private */
  viewportSize?: {
    width: number
    height: number
  }
}

export type InjectResult = {
  testCaseFile: string
  injectedCode: string
}
