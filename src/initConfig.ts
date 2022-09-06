import fs from 'fs'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import template from '@babel/template'
import * as t from '@babel/types'
import { resolveRoot } from './tool'
import { PLAYWRIGHT_CONFIG_FILE, DEFAULT_CONFIG, PKG_NAME } from './constant'
import { Config } from './type'
import { ok, log, err } from './logger'

export const initConfig = (config?: Config) => {
  config = config || DEFAULT_CONFIG
  const playwrightConfigFile = resolveRoot(PLAYWRIGHT_CONFIG_FILE)
  if (!fs.existsSync(playwrightConfigFile)) {
    throw new Error(
      `you shoul prepare "${PLAYWRIGHT_CONFIG_FILE}" first! Go to read https://playwright.dev/docs/test-configuration#global-configuration`,
    )
  }
  const source = fs.readFileSync(playwrightConfigFile, 'utf8')
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['typescript'],
  })
  let injected = false
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === PKG_NAME) {
        injected = true
      }
    },
  })
  if (injected) {
    log(err(`your ${PLAYWRIGHT_CONFIG_FILE} already injected ${PKG_NAME} config`))
    throw new Error(`can not reinject ${PKG_NAME} config`)
  }

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === '@playwright/test') {
        const templ = template.ast(`import { PramConfig } from 'playwright-record-and-mock'`)
        path.insertAfter(templ)
        path.skip()
      }
    },
    TSTypeAnnotation(path) {
      const { typeAnnotation } = path.node
      if (t.isTSTypeReference(typeAnnotation)) {
        const { typeName } = typeAnnotation
        if (t.isIdentifier(typeName)) {
          if (typeName.name === 'PlaywrightTestConfig') {
            // path.insertAfter(t)
            const n = t.tsIntersectionType([
              t.tsTypeReference(t.identifier('PlaywrightTestConfig')),
              t.tsTypeReference(t.identifier('PramConfig')),
            ])
            const n1 = t.tsTypeAnnotation(n)
            path.replaceWith(n1)
            const idenPath = path.parentPath?.parentPath
            const identityNode = idenPath?.node
            if (idenPath && t.isVariableDeclarator(identityNode)) {
              const { init } = identityNode
              if (t.isObjectExpression(init)) {
                if (
                  init.properties.some(p => {
                    if (t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === 'pram') {
                      return true
                    }
                    return false
                  })
                ) {
                  return
                }
                const configNode = t.objectExpression(
                  Object.getOwnPropertyNames(config).map<t.ObjectProperty>(key => {
                    const value = config![key as keyof Config]
                    if (typeof value === 'string') {
                      return t.objectProperty(t.identifier(key), t.stringLiteral(value))
                    }
                    if (value instanceof RegExp) {
                      return t.objectProperty(t.identifier(key), t.regExpLiteral(String(value).slice(1, -1)))
                    }
                    // istanbul ignore next
                    throw new Error(`unknown config property type, key: key, value: ${value}`)
                  }),
                )
                // [
                // t.objectProperty(t.identifier('outDir'), t.stringLiteral('e2e')),
                // t.objectProperty(t.identifier('site'), t.stringLiteral('https://cn.bing.com/')),
                // t.objectProperty(t.identifier('urlFilter'), t.regExpLiteral('\\/AS\\/Suggestions')),
                // ])
                init.properties.push(t.objectProperty(t.identifier('pram'), configNode))
              }
              idenPath.replaceWith(idenPath.node)
            }
            path.skip()
          }
        }
      }
    },
  })
  const newCode = generate(ast).code
  fs.writeFileSync(playwrightConfigFile, newCode)
  log('write to', ok(PLAYWRIGHT_CONFIG_FILE), 'success.')
}
