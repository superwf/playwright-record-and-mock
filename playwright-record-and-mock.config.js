/**
 * @type {import('playwright-record-and-mock/lib/type').UserConfig}
 * */
module.exports = {
  outDir: 'e2e',
  site: 'https://www.npmjs.com/',
  headless: false,
  urlFilter: /\/search\/suggestions/,
}
