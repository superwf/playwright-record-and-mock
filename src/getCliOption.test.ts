import { getCliOption, resetCache } from './getCliOption'

describe('cli option', () => {
  // const originLength = process.argv.length
  afterEach(() => {
    // process.argv.length = originLength
    resetCache()
  })

  it('test init', async () => {
    const result = await getCliOption(['', '', 'init'])
    expect(result.init).toBe(true)
    expect(result.caseName).toBe('')
  })

  it('test casename', async () => {
    const result = await getCliOption(['', '', 'myCase'])
    expect(result.caseName).toBe('myCase')
    expect(result.init).toBeFalsy()
  })

  it('test -c -s', async () => {
    const result = await getCliOption(['', '', 'record', 'myCase1', '-s', 'http://example.com'])
    expect(result.caseName).toBe('myCase1')
    expect(result.site).toBe('http://example.com')
    expect(result.init).toBeFalsy()
  })

  it('test no -i', async () => {
    const result = await getCliOption(['', '', 'case1'])
    expect(result.init).toBeFalsy()
    expect(result.caseName).toBe('case1')
  })

  it('use cache', async () => {
    const result = await getCliOption(['', '', 'myCase', '-s', 'http://example.com'])
    const result1 = await getCliOption(['', '', 'myCase1', '-s', 'http://example.com'])
    expect(result).toBe(result1)
  })

  it('viewport', async () => {
    const result = await getCliOption(['', '', 'mycase', '-v', '111,222'])
    expect(result.viewport).toBe('111,222')
  })
})
