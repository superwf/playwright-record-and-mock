export type ConfigOption = {
  mockFilePath: string
  urlMatcher: RegExp
}

export type ResponseMap = Record<
  string,
  {
    status: number
    headers: Record<string, string>
    contentType: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  }[]
>
