export interface KeywordLink {
  url: string;
  keyword: string;
  description?: string;
}

const database = new Map<string, KeywordLink>();

export class NotFoundError extends Error {};

export const getKeywordLink = (keyword: string) => {
  if (database.has(keyword)) return database.get(keyword)
  throw new NotFoundError(`Entry with keyword "${keyword}" was not found`);
};

export const setKeywordLink = (keyword: string, keywordLink: KeywordLink) => {
  database.set(keyword, keywordLink);
}
