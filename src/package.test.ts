import pkg from '../package.json'
import { PKG_NAME } from './constant'

it('package.json key fiels', () => {
  expect(pkg.name).toBe(PKG_NAME)
  expect(pkg.files).toEqual(['tsconfig.json', 'lib', 'playwright-record-and-mock.config.ts'])
})
