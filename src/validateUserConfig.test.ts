import { validateUserConfig } from './validateUserConfig'
import { Config } from './type'

it('validateUserConfig throw', () => {
  expect(() => validateUserConfig({} as Config)).toThrow()

  expect(() =>
    validateUserConfig({
      outDir: 'ee',
      site: 'aa',
    } as Config),
  ).toThrow()
  expect(() =>
    validateUserConfig({
      outDir: 'ee',
      urlFilter: /api/,
    } as Config),
  ).toThrow()
  expect(() =>
    validateUserConfig({
      urlFilter: /api/,
      site: 'http://abc',
    } as Config),
  ).toThrow()
})

it('validateUserConfig ok', () => {
  expect(() =>
    validateUserConfig({
      outDir: 'ee',
      urlFilter: 'aa',
      site: 'aa',
    }),
  ).not.toThrow()

  expect(() =>
    validateUserConfig({
      outDir: 'ee',
      urlFilter: /aa/,
      site: 'aa',
    }),
  ).not.toThrow()

  expect(() =>
    validateUserConfig({
      outDir: 'ee',
      urlFilter: u => u.href.length > 0,
      site: 'aa',
    }),
  ).not.toThrow()
})
