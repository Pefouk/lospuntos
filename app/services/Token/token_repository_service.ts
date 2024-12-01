import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import { Info } from 'luxon'
import isValidIANAZone = Info.isValidIANAZone
import Token from '#models/token'

type TLeaderBoard = {
  username: string
  score: number
}

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
  async claim(authorId: number, toId: number, value: number, code: string) {
    const res = await Token.updateOrCreate(
      {
        code: code,
      },
      {
        value: value,
        targetTo: toId,
        claimedBy: authorId,
      }
    )

    return res
  }

  async history(user: User) {
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
  }

  async score(user: User) {
    const res = await db
      .query<{ score: number }>()
      .from('tokens')
      .sum('tokens.value as score')
      .where('tokens.target_to', user.id)
      .firstOrFail()

    return res.score ?? 0
  }

  async leaderBoard() {
    const res = await db
      .query<TLeaderBoard>()
      .from('users')
      .select('users.username as username')
      .select('users.id as userId')
      .sum('tokens.value', 'score')
      .leftJoin('tokens', 'users.id', '=', 'tokens.target_to')
      .groupBy('users.id')
      .orderBy('score', 'desc')
      .exec()

    return res.map((user) => {
      return {
        ...user,
        score: user.score ?? 0,
      }
    })
  }
}
