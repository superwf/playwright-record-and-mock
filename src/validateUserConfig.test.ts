import { validateUserConfig } from './validateUserConfig'
import { UserConfig } from './type'

it('validateUserConfig throw', () => {
  expect(() => validateUserConfig({} as UserConfig)).toThrow()

  expect(() =>
    validateUserConfig({
      outDir: 'ee',
      site: 'aa',
    } as UserConfig),
  ).toThrow()
  expect(() =>
    validateUserConfig({
      outDir: 'ee',
      urlFilter: /api/,
    } as UserConfig),
  ).toThrow()
  expect(() =>
    validateUserConfig({
      urlFilter: /api/,
      site: 'http://abc',
    } as UserConfig),
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
      headless: true,
    }),
  ).not.toThrow()
})
