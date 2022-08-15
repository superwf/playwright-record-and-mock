import { UserConfig } from 'playwright-record-and-mock'

const config: UserConfig = {
  /** the place to store your e2e test cases */
  outDir: 'e2e',
  /** your target test site */
  site: 'https://www.npmjs.com/',
  /** decide which url should be recorded */
  urlFilter: /\/search\/suggestions/,
}
export default config
