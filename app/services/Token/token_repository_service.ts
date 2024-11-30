import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

type TLeaderBoard = [
  {
    username: string
    score: number
  },
]

type THistory = [
  {
    from: string
    fromId: number
    to: string
    toId: number
    value: string
    date: Date
    code: string
  },
]

export default class TokenRepository {
  async history(user: User) {
    try {
      return await db
        .query<THistory>()
        .from('tokens')
        .select('tokens.value as value')
        .select('tokens.updated_at as date')
        .select('tokens.code as code')
        .select('from.username as from')
        .select('from.id as fromId')
        .select('to.id as toId')
        .select('to.username as to')
        .leftJoin('users as from', 'from.id', '=', 'tokens.claimed_by')
        .leftJoin('users as to', 'to.id', '=', 'tokens.target_to')
        .where('to.id', user.id)
        .orWhere('from.id', user.id)
        .exec()
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async score(user: User) {
    try {
      const res = await db
        .query<{ score: number }>()
        .from('tokens')
        .sum('tokens.value as score')
        .where('tokens.target_to', user.id)
        .firstOrFail()

      return res.score
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async leaderBoard() {
    try {
      return await db
        .query<TLeaderBoard>()
        .from('users')
        .select('users.username')
        .sum('tokens.value', 'score')
        .leftJoin('tokens', 'users.id', '=', 'tokens.target_to')
        .groupBy('users.id')
        .orderBy('score', 'desc')
        .exec()
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
