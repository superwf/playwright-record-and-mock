import { getCliOption, resetCache } from './getCliOption'

describe('cli option', () => {
  // const originLength = process.argv.length
  afterEach(() => {
    // process.argv.length = originLength
    resetCache()
  })

  it('test -i', async () => {
    const result = getCliOption(['', '', '-i'])
    expect(result.init).toBe(true)
    expect(result.caseName).toBe('')
  })

  it('test --init', () => {
    const result = getCliOption(['', '', '--init'])
    expect(result.init).toBe(true)
    expect(result.caseName).toBe('')
  })

  it('test no -i', () => {
    const result = getCliOption(['', ''])
    expect(result.init).toBe(false)
    expect(result.caseName).toBe('')
  })

  it('test -c -s', () => {
    const result = getCliOption(['', '', '-c', 'myCase', '-s', 'http://example.com'])
    expect(result.caseName).toBe('myCase')
    expect(result.site).toBe('http://example.com')
    expect(result.init).toBe(false)
  })

  it('use cache', () => {
    const result = getCliOption(['', '', '-c', 'myCase', '-s', 'http://example.com'])
    const result1 = getCliOption(['', '', '-c', 'myCase', '-s', 'http://example.com'])
    expect(result).toBe(result1)
  })
})
