import fs from 'fs'
import { injectTestCase } from './injectTestCase'

it('injectTestCase', () => {
  const res = injectTestCase({
    outDir: 'e2e',
    caseName: 'npm',
  })
  expect(res.injectedCode).toMatchSnapshot()
  // const code = fs.readFileSync(testCaseFile, 'utf8')
  // console.log(code)
})
