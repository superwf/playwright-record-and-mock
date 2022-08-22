import type { Request } from '@playwright/test'
import path from 'path'
import { ensureDirSync, existsSync, writeFileSync } from 'fs-extra'
import {
  encodeToBase64,
  decodeFromBase64,
  resolveRoot,
  isContentTypeText,
  isContentTypeJson,
  viewportSizeToViewportDimension,
  getTestCaseMainFixtureFilePath,
  getTestCaseFixtureFilePath,
  cleanTestCaseFixtureFilePath,
  isUrlMatched,
  generateResponseMapKey,
  getTestCaseFilePath,
} from './tool'
import { MAIN_FIXTURE_FILE, FIXTURES_DIR, TEST_CASE_FILE_NAME } from './constant'
import { testInTempPath } from './testTool'

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

it('content json type', () => {
  ;['application/json', 'application/json;charset=utf8'].forEach(t => {
    expect(isContentTypeJson(t)).toBe(true)
  })
})

it('viewportSizeToViewportDimension', () => {
  expect(viewportSizeToViewportDimension('111,222')).toEqual({
    width: 111,
    height: 222,
  })

  expect(() => viewportSizeToViewportDimension('')).toThrow()
  expect(viewportSizeToViewportDimension()).toBeUndefined()
  expect(() => {
    viewportSizeToViewportDimension(' ')
  }).toThrow()
})

it('getTestCaseMainFixtureFilePath', () => {
  expect(getTestCaseMainFixtureFilePath('e2e', 'mycase')).toBe(
    resolveRoot(path.join('e2e', 'mycase', MAIN_FIXTURE_FILE)),
  )
})

it('isUrlMatched', () => {
  expect(isUrlMatched(new URL('http://www.com'))).toBe(true)
  expect(isUrlMatched(new URL('http://www.com'), '/api')).toBe(false)
  expect(isUrlMatched(new URL('http://www.com'), /api/)).toBe(false)
  expect(isUrlMatched(new URL('http://www.com/api/user'), '**/api/**')).toBe(true)
  expect(isUrlMatched(new URL('http://www.com/api/user'), /\/api\//)).toBe(true)
  expect(isUrlMatched(new URL('http://www.com/api/user'), u => u.href.includes('/api/'))).toBe(true)
  expect(isUrlMatched(new URL('http://www.com/api/user'))).toBe(true)
  expect(() => isUrlMatched(new URL('http://a.com'), 1 as unknown as string)).toThrow()
})

it('cleanTestCaseFixtureFilePath', () => {
  const { testPath, restore } = testInTempPath()
  const dir = path.join(testPath, 'e2e', 'mycase', FIXTURES_DIR)
  ensureDirSync(dir)
  const filepath = path.join(dir, 'abc')
  writeFileSync(filepath, 'data')
  expect(existsSync(filepath)).toBe(true)
  cleanTestCaseFixtureFilePath('e2e', 'mycase')
  expect(existsSync(filepath)).toBe(false)
  restore()
})

it('getTestCaseFixtureFilePath', () => {
  expect(getTestCaseFixtureFilePath('e2e', 'mycase', 'bca')).toBe(
    resolveRoot(path.join('e2e', 'mycase', FIXTURES_DIR, 'bca')),
  )
})

it('generateResponseMapKey', () => {
  expect(
    generateResponseMapKey({
      url() {
        return 'https://www.npmjs.com/abc?def=333'
      },
      method() {
        return 'GET'
      },
    } as Request),
  )
})

it('getTestCaseFilePath', () => {
  expect(getTestCaseFilePath('e2e', 'case1')).toBe(resolveRoot(path.join('e2e', 'case1', TEST_CASE_FILE_NAME)))
})
