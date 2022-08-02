export type ConfigOption = {
  mockFilePath: string
  urlMatcher: RegExp
}

export type ResponseMap = Record<
  string,
  {
    headers: Record<string, string>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  }[]
>
