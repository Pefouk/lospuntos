import vine from '@vinejs/vine'

export const TokenCreateValidator = vine.compile(
  vine.object({
    code: vine
      .string()
      .minLength(4)
      .exists(async (db, value) => {
        const res = await db
          .query<{ count: number }>()
          .from('tokens')
          .sum('tokens.id', 'count')
          .where('tokens.code', '=', value)
          .firstOrFail()
        return res.count === null
      }),

    value: vine.number().nullable(),
  })
)
