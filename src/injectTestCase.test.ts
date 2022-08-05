import { injectTestCase } from './injectTestCase'

it('injectTestCase', () => {
  const res = injectTestCase({
    outDir: 'e2e',
    caseName: 'npm',
  })
  expect(res.injectedCode).toMatchSnapshot()
})
