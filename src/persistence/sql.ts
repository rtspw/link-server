export const createLinkTableSQL = `
  CREATE TABLE IF NOT EXISTS link (
    id integer PRIMARY KEY AUTOINCREMENT,
    url text NOT NULL UNIQUE
  )
`
export const createKeywordTableSQL = `
  CREATE TABLE IF NOT EXISTS keyword (
    id integer PRIMARY KEY AUTOINCREMENT,
    word text NOT NULL UNIQUE
  )
`

export const createKeywordLinkTableSQL = `
  CREATE TABLE IF NOT EXISTS keyword_link (
    id integer PRIMARY KEY AUTOINCREMENT,
    link_id integer NOT NULL,
    keyword_id integer NOT NULL,
    desc text,
    FOREIGN KEY(link_id) REFERENCES link(id),
    FOREIGN KEY(keyword_id) REFERENCES keyword(id),
    UNIQUE(link_id, keyword_id)
  )
`

export const addLinkSQL = `
  INSERT OR IGNORE INTO link (url)
  VALUES (?)
`

export const addKeywordSQL = `
  INSERT OR IGNORE INTO keyword (word)
  VALUES (?)
`

export const addKeywordLinkSQL = `
  INSERT INTO keyword_link (link_id, keyword_id, desc)
  VALUES (?, ?, ?)
`

export const findKeywordIDSQL = `
  SELECT id
  FROM keyword
  WHERE word = ?
`

export const findLinkIDSQL = `
  SELECT id
  FROM link
  WHERE url = ?
`

export const findKeywordLinkByKeywordSQL = `
  SELECT K.word, L.url, KL.desc
  FROM keyword_link as KL
  JOIN link AS L
    ON KL.link_id = L.id
  JOIN keyword AS K
    ON KL.keyword_id = K.id
  WHERE K.word = ?
`
