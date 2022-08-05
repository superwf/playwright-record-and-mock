import fs from 'fs'

import type { BrowserContextOptions, LaunchOptions } from '@playwright/test'
import { chromium } from '@playwright/test'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import template from '@babel/template'
import type { Statement } from '@babel/types'
import { isIdentifier, isBlockStatement } from '@babel/types'
import { resolveRoot } from './helper'

// copy from playwright-core source
type EnableRecorderOption = {
  language: string
  launchOptions?: LaunchOptions
  contextOptions?: BrowserContextOptions
  device?: string
  saveStorage?: string
  startRecording?: boolean
  outputFile?: string
}

const { CASE_NAME } = process.env
if (!CASE_NAME) {
  throw new Error('必须输入一个测试用例名字名字')
}

export const afterRecord = () => {
  const code = fs.readFileSync(resolveRoot(`e2e/${CASE_NAME}.spec.ts`), 'utf8')

  const ast = parse(code, {
    sourceType: 'module',
  })

  const t = template(`
import { factory } from 'playwright-record-and-mock'
const { record, mock } = factory({
  mockFilePath: 'fixture/npmjs.json',
  urlMatcher: /\\/search\\//,
})
record()
`)
  traverse(ast, {
    CallExpression(path) {
      const { callee } = path.node
      if (isIdentifier(callee)) {
        if (callee.name === 'test') {
          path.insertBefore(t())
          // path.skip()
        }
      }
    },
    ArrowFunctionExpression(path) {
      if (isBlockStatement(path.node.body)) {
        const { body } = path.node.body
        if (Array.isArray(body)) {
          body.unshift(template.ast(`mock(page);`) as Statement)
        }
      }
      // push(template.ast(`const aaa = 1`)))
    },
    // enter(path) {
    //   if (path.isImport()) {
    //     // path.node.name = 'x'
    //     console.log(path.node)
    //   }
    // },
  })
  const output = generate(ast)
  // console.log(output.code)
  fs.writeFileSync(resolveRoot(`e2e/${CASE_NAME}.spec.ts`), output.code, {
    encoding: 'utf8',
  })
}

export const autoRecord = async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 974 },
  })
  // eslint-disable-next-line
  await (context as any)._enableRecorder({
    startRecording: true,
    language: 'test',
    outputFile: `e2e/${CASE_NAME}.spec.ts`,
  } as EnableRecorderOption)
  const page = await context.newPage()
  await page.goto('https://baidu.com')
  // await browser.close()
  await new Promise(resolve => {
    page.on('close', () => {
      setTimeout(() => {
        browser.close()
        resolve(null)
      }, 1000)
    })
  })
  afterRecord()
}
