import vine from '@vinejs/vine'

export const TokenClaimValidator = vine.compile(
  vine.object({
    code: vine
      .string()
      .minLength(4)
      .unique(async (db, value) => {
        const res = await db
          .query<{ count: number }>()
          .from('tokens')
          .sum('tokens.id', 'count')
          .where('tokens.code', '=', value)
          .andWhere('tokens.claimed_by', '=', 'null')
          .firstOrFail()

        console.log(res)
        return res.count === null
      }),

    bonus: vine.enum(['bonus', 'malus']),

    target: vine.number().exists(async (db, value) => {
      const res = await db
        .query<{ count: number }>()
        .from('users')
        .sum('users.id', 'count')
        .where('users.id', '=', value)
        .firstOrFail()

      console.log(res)
      return res.count !== null
    }),
  })
)
