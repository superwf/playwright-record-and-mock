import minimatch from 'minimatch'
import { UrlFilter } from './type'

export const isUrlMatched = (url: URL, urlFilter: UrlFilter): boolean => {
  if (!urlFilter) {
    return true
  }
  if (typeof urlFilter === 'string') {
    return minimatch(url.href, urlFilter)
  }
  if (urlFilter instanceof RegExp) {
    return urlFilter.test(url.href)
  }
  if (typeof urlFilter === 'function') {
    return urlFilter(url)
  }
  return true
}
