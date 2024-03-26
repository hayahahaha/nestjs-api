import { UserSearchBody } from './userSearchBody.interface'

export interface UserSearchResult {
  hits: {
    total: number,
    hits: Array<{
      _source: UserSearchBody
    }>
  }
}
