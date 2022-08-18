/* eslint-disable no-param-reassign */
import { UserConfig } from 'playwright-record-and-mock'

const config: UserConfig = {
  /** the place to store your e2e test cases */
  outDir: 'e2e',
  /** your target test site full url, as https://www.npmjs.com */
  site: 'https://www.npmjs.com/',
  /** decide which url should be recorded */
  urlFilter: /\/search\/suggestions/,

  /**
   * should record all fixture data in one file
   * @default false
   * */
  // shouldRecordALlInOne: true

  /**
   * if the response headers too much
   * you can use this to remove some useless header
   * */
  // responseHeadersInterceptor(headers) {
  //   Object.getOwnPropertyNames(headers).forEach(key => {
  //     if (key.startsWith('x-')) {
  //       delete headers[key]
  //     }
  //   })
  //   return headers
  // },
}
export default config
