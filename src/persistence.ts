export interface KeywordLink {
  url: string
  keyword: string
  description?: string
}

const database = new Map<string, KeywordLink>()

export class NotFoundError extends Error {};

export const getKeywordLink = (keyword: string): KeywordLink => {
  const keywordLink = database.get(keyword)
  if (keywordLink !== undefined) {
    return keywordLink
  } else {
    throw new NotFoundError(`Entry with keyword "${keyword}" was not found`)
  }
}

export const setKeywordLink = (keyword: string, keywordLink: KeywordLink): void => {
  database.set(keyword, keywordLink)
}
