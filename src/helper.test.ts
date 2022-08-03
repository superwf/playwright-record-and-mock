import { encodeToBase64, decodeFromBase64 } from './helper'

it('base encode and decode', () => {
  const str = 'abcdef'
  expect(decodeFromBase64(encodeToBase64(str)).toString('utf8')).toBe(str)
})
