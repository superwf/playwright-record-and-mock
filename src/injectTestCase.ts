import fs from 'fs'

import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import template from '@babel/template'
import type { Statement } from '@babel/types'
import { isIdentifier, isBlockStatement } from '@babel/types'

import { resolveRoot } from './resolveRoot'
import { getCliOption } from './getCliOption'

export const injectTestCase = () => {
  const { caseName } = getCliOption()
  const code = fs.readFileSync(resolveRoot(`e2e/${caseName}.spec.ts`), 'utf8')

  const ast = parse(code, {
    sourceType: 'module',
  })

  const t = template(`
import { mock } from 'playwright-record-and-mock'
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
  fs.writeFileSync(resolveRoot(`e2e/${caseName}.spec.ts`), output.code, {
    encoding: 'utf8',
  })
}
