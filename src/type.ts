export type ConfigOption = {
  mockFilePath: string
  urlMatcher: RegExp
}

export type RecordResponse = {
  status: number
  headers: Record<string, string>
  contentType: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export type ResponseMap = Record<string, RecordResponse[]>

export type UrlFilter = string | RegExp | ((url: URL) => boolean)

export type UserConfig = {
  /** the place to store your e2e test cases */
  outDir: string
  /** decide which url should be recorded */
  urlFilter: UrlFilter
  /** your target test site */
  site: string
  /** split by ",", as "1920,1080" */
  viewportSize?: string
  /** default false, set true for headless browser mode */
  headless?: boolean
}

export type CliOption = {
  /** @private */
  cached: boolean

  site?: string
  /** split by ",", as "1920,1080" */
  viewportSize?: string

  init: boolean
  caseName: string
}

export type Config = {
  cached: boolean
  init: boolean
  site: string
  headless?: boolean
  urlFilter: UrlFilter
  outDir: string
  caseName: string
  viewportSize?: {
    width: number
    height: number
  }
}

export type InjectResult = {
  testCaseFile: string
  injectedCode: string
}
