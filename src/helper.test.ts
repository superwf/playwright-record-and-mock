import { encodeToBase64, decodeFromBase64, isContentTypeText, viewportSizeToViewportDimension } from './helper'

it('base encode and decode', () => {
  const str = 'abcdef'
  expect(decodeFromBase64(encodeToBase64(str)).toString('utf8')).toBe(str)
})

it('content type is text', () => {
  ;[
    'text/plain',
    'text/html; charset=utf8',
    'application/javascript',
    'text/css',
    'application/xml',
    'application/xhtml',
  ].forEach(t => {
    expect(isContentTypeText(t)).toBe(true)
  })
  ;['application/json', 'image/png', 'font/woff'].forEach(t => {
    expect(isContentTypeText(t)).not.toBe(true)
  })
})

it('viewportSizeToViewportDimension', () => {
  expect(viewportSizeToViewportDimension('111,222')).toEqual({
    width: 111,
    height: 222,
  })

  expect(viewportSizeToViewportDimension('')).toBeUndefined()
  expect(viewportSizeToViewportDimension()).toBeUndefined()
  expect(() => {
    viewportSizeToViewportDimension(' ')
  }).toThrow()
})
