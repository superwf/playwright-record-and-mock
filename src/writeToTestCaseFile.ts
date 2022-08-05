import { writeFileSync } from 'fs'
import { format } from 'prettier'
import { InjectResult } from './type'

export const writeToTestCaseFile = (res: InjectResult) => {
  writeFileSync(
    res.testCaseFile,
    format(res.injectedCode, {
      printWidth: 120,
      useTabs: false,
      tabWidth: 2,
      singleQuote: true,
      semi: false,
      trailingComma: 'all',
      endOfLine: 'auto',
      arrowParens: 'avoid',
      parser: 'typescript',
    }),
    {
      encoding: 'utf8',
    },
  )
}
