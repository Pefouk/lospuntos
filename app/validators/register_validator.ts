import vine from '@vinejs/vine'

export const RegisterValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .minLength(3)
      .maxLength(20)
      .unique(async (db, value) => {
        const user = await db
          .query<{ count: number }>()
          .from('users')
          .sum('users.id as count')
          .where('users.username', '=', value)
          .firstOrFail()

        return user.count === null
      }),

    name: vine.string().minLength(3).maxLength(512),

    password: vine.string().minLength(8),

    confirmPassword: vine.string().sameAs('password'),
  })
)
