import { getUserConfig } from './getUserConfig'
import config from '../playwright-record-and-mock.config.js'

test('getConfig', () => {
  expect(getUserConfig()).toEqual(config)
})
