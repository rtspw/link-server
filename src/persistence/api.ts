import type { KeywordLink } from './database'
import { getInstance } from './database'
import * as Errors from './errors'

const dbInstance = getInstance()

export { KeywordLink }
export { Errors }

export const getKeywordLink = (keyword: string): KeywordLink => {
  const keywordLink = dbInstance.findKeywordLinkByKeyword(keyword)
  if (keywordLink !== null) {
    return keywordLink
  } else {
    throw new Errors.NotFoundError(`Entry with keyword "${keyword}" was not found`)
  }
}

export const getAllKeywordLinks = (keyword: string): KeywordLink[] => {
  const keywordLinks = dbInstance.findAllKeywordLinks(keyword)
  return keywordLinks
}

export const setKeywordLink = (keyword: string, url: string, description?: string): void => {
  dbInstance.addKeywordLink({ keyword, url, description })
}
