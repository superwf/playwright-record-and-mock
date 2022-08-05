/**
 * @type {import('playwright-record-and-mock/lib/type').UserConfig}
 * */
module.exports = {
  /** the place to store your e2e test cases */
  outDir: 'e2e',
  /** your target test site */
  site: 'https://www.npmjs.com/',
  /** decide which url should be recorded */
  urlFilter: /\/search\/suggestions/,
  /** default false, set true for headless browser mode */
  headless: false,
}
