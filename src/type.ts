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
  outDir: string
  urlFilter: UrlFilter
  /** split by ",", as "1920,1080" */
  viewportSize?: string
  site: string
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
  site: string
  urlFilter: UrlFilter
  outDir: string
  viewport:
    | {
        width: number
        height: number
      }
    | undefined
}
