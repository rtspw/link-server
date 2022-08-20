import sqlite from 'better-sqlite3'
import * as sql from './sql'
import { KeywordLinkExistsError } from './errors'

const dbFilename = process.env.DB_FILE ?? 'main.db'
const db = sqlite(dbFilename)

export interface KeywordLink {
  url: string
  keyword: string
  description?: string
}

const createLinkTableStmt = db.prepare(sql.createLinkTableSQL)
const createKeywordTableStmt = db.prepare(sql.createKeywordTableSQL)
const createKeywordLinkTableStmt = db.prepare(sql.createKeywordLinkTableSQL)

class Database {
  private readonly addKeywordStmt: sqlite.Statement<[string]>
  private readonly addLinkStmt: sqlite.Statement<[string]>
  private readonly addKeywordLinkStmt: sqlite.Statement<[number | bigint, number | bigint, string?]>
  private readonly findKeywordIDStmt: sqlite.Statement<[string]>
  private readonly findLinkIDStmt: sqlite.Statement<[string]>
  private readonly findKeywordLinkByKeywordStmt: sqlite.Statement<[string]>
  constructor () {
    this.initializeDB()
    this.addLinkStmt = db.prepare<string>(sql.addLinkSQL)
    this.addKeywordStmt = db.prepare<string>(sql.addKeywordSQL)
    this.addKeywordLinkStmt = db.prepare<[number, number, string?]>(sql.addKeywordLinkSQL)
    this.findKeywordIDStmt = db.prepare<[string]>(sql.findKeywordIDSQL)
    this.findLinkIDStmt = db.prepare<[string]>(sql.findLinkIDSQL)
    this.findKeywordLinkByKeywordStmt = db.prepare<[string]>(sql.findKeywordLinkByKeywordSQL)
  }

  private initializeDB (): void {
    createLinkTableStmt.run()
    createKeywordTableStmt.run()
    createKeywordLinkTableStmt.run()
  }

  addKeywordLink (keywordLink: KeywordLink): void {
    const { keyword, url, description } = keywordLink
    const linkID = (() => {
      const searchResult = this.findLinkID(url)
      if (searchResult !== null) return searchResult
      const addLinkResult = this.addLinkStmt.run(url)
      return addLinkResult.lastInsertRowid
    })()
    const keywordID = (() => {
      const searchResult = this.findKeywordID(keyword)
      if (searchResult !== null) return searchResult
      const addKeywordResult = this.addKeywordStmt.run(keyword)
      return addKeywordResult.lastInsertRowid
    })()
    try {
      this.addKeywordLinkStmt.run(linkID, keywordID, description)
    } catch (error) {
      if (error instanceof sqlite.SqliteError && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new KeywordLinkExistsError(`(${keyword}) already connects to url (${url})`)
      } else {
        throw error
      }
    }
  }

  findKeywordID (keyword: string): number | bigint | null {
    const result = this.findKeywordIDStmt.get(keyword)
    if (result === undefined) return null
    return result.id
  }

  findLinkID (url: string): number | bigint | null {
    const result = this.findLinkIDStmt.get(url)
    if (result === undefined) return null
    return result.id
  }

  findKeywordLinkByKeyword (query: string): KeywordLink | null {
    const result = this.findKeywordLinkByKeywordStmt.get(query)
    if (result === undefined) return null
    const { word: keyword, url, desc: description } = result
    return { keyword, url, description }
  }

  findAllKeywordLinks (query: string): KeywordLink[] {
    const result = this.findKeywordLinkByKeywordStmt.all(query)
    const keywordLinks = result.map(queryResult => ({
      keyword: queryResult.word,
      url: queryResult.url,
      description: queryResult.desc
    }))
    return keywordLinks
  }
}

let dbInstance: Database | null = null

export function getInstance (): Database {
  if (dbInstance !== null) return dbInstance
  dbInstance = new Database()
  return dbInstance
}
