import { promises } from 'fs-extra'
import { format } from 'prettier'
import { InjectResult } from './type'

export const writeToTestCaseFile = async (res: InjectResult) => {
  // must delay after playwright write
  await new Promise(resolve => {
    setTimeout(resolve, 2000)
  })
  await promises.writeFile(
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
  // eslint-disable-next-line no-console
  console.log(`record test case ${res.testCaseFile} ok`)
}
