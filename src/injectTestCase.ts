import fs from 'fs'

import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import template from '@babel/template'
import type { Statement } from '@babel/types'
import { isIdentifier, isCallExpression, isBlockStatement } from '@babel/types'

import { getTestCaseFilePath } from './tool'
import { InjectResult } from './type'

export const injectTestCase = ({ caseName, outDir }: { caseName: string; outDir: string }): InjectResult => {
  const testCaseFile = getTestCaseFilePath(outDir, caseName)
  const source = fs.readFileSync(testCaseFile, 'utf8')

  const ast = parse(source, {
    sourceType: 'module',
  })

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === '@playwright/test') {
        const t = template.ast(`
      import { mock } from 'playwright-record-and-mock'
      `)
        path.insertAfter(t)
        path.skip()
      }
    },
    ArrowFunctionExpression(path) {
      if (isCallExpression(path.parentPath.node)) {
        const { callee } = path.parentPath.node
        // 判断是否为 test 的调用参数函数
        if (isIdentifier(callee) && callee.name === 'test') {
          if (isBlockStatement(path.node.body)) {
            const { body } = path.node.body
            if (Array.isArray(body)) {
              const alreadyMock = body.some(node =>
                source.slice(node.start as number, node.end as number).includes('mock(page)'),
              )
              if (!alreadyMock) {
                body.unshift(template.ast(`await mock(page, '${caseName}');`) as Statement)
              }
            }
          }
        }
      }
    },
  })
  const injectedCode = generate(ast).code
  return {
    testCaseFile,
    injectedCode,
  }
}
