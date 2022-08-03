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
